import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./profile-settings.css";

const today = new Date();
const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

const profileSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at most 15 digits"),
  password: z
    .string()
    .refine((value) => value.length === 0 || value.length >= 8, {
      message: "Password must be at least 8 characters when changing it"
    }),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: "Date of birth must be a valid date"
    })
    .refine((value) => {
      const inputDate = new Date(`${value}T00:00:00`);
      return inputDate <= todayOnly;
    }, "Date of birth cannot be in the future"),
  address: z.string().min(1, "Address is required")
});

function ProfileSettings({
  userName = "Hareem Shakeel",
  onSave = () => {}
}) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      phoneNumber: "",
      password: "",
      dateOfBirth: "",
      address: ""
    }
  });

  return (
    <div className="profile-page-wrapper">
      <main className="profile-card">
        <header className="profile-header">
          <button type="button" className="back-button" aria-label="Go back">
            &#8249;
          </button>
          <div className="avatar-holder">
            <img
              src="https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=240&q=80"
              alt={`${userName} profile`}
              className="profile-avatar"
            />
            <button
              type="button"
              className="avatar-edit-button"
              aria-label="Edit profile photo"
            >
              &#9998;
            </button>
          </div>
          <h1>{userName}</h1>
        </header>

        <form
          className="profile-form"
          onSubmit={handleSubmit(onSave)}
          noValidate
          aria-label="Profile settings form"
        >
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="Email" {...register("email")} />
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="phoneNumber">Phone number</label>
            <input
              id="phoneNumber"
              type="tel"
              inputMode="numeric"
              placeholder="Phone number"
              {...register("phoneNumber")}
            />
            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber.message}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="password">Password</label>
            <div className="password-row">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                className="password-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="dateOfBirth">Date of birth</label>
            <input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            {errors.dateOfBirth && <p className="error-text">{errors.dateOfBirth.message}</p>}
          </div>

          <div className="field-group">
            <label htmlFor="address">Address</label>
            <input id="address" type="text" placeholder="Address" {...register("address")} />
            {errors.address && <p className="error-text">{errors.address.message}</p>}
          </div>

          <button type="submit" className="save-button" disabled={!isValid}>
            Save
          </button>
        </form>
      </main>
    </div>
  );
}

export default ProfileSettings;
