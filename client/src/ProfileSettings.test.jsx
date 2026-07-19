import React from "react";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, afterEach } from "vitest";
import ProfileSettings from "./ProfileSettings";

function fillRequiredValidFields() {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "hareem@example.com" }
  });
  fireEvent.change(screen.getByLabelText(/phone number/i), {
    target: { value: "03001234567" }
  });
  fireEvent.change(screen.getByLabelText(/date of birth/i), {
    target: { value: "2000-05-10" }
  });
  fireEvent.change(screen.getByLabelText(/address/i), {
    target: { value: "Lahore, Pakistan" }
  });
}

afterEach(() => {
  cleanup();
});

describe("ProfileSettings", () => {
  it("submits successfully with valid data", async () => {
    const onSave = vi.fn();
    render(<ProfileSettings onSave={onSave} />);

    fillRequiredValidFields();

    const saveButton = screen.getByRole("button", { name: /save/i });
    await waitFor(() => expect(saveButton).toBeEnabled());

    await userEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledTimes(1);
    const submittedData = onSave.mock.calls[0][0];
    expect(submittedData).toEqual(
      expect.objectContaining({
        email: "hareem@example.com",
        phoneNumber: "03001234567",
        password: "",
        dateOfBirth: "2000-05-10",
        address: "Lahore, Pakistan"
      })
    );
  });

  it("shows errors for empty required fields", async () => {
    render(<ProfileSettings />);

    const form = screen.getByRole("form", { name: /profile settings form/i });
    fireEvent.submit(form);

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(await screen.findByText(/phone number must contain only digits/i)).toBeInTheDocument();
    expect(await screen.findByText(/date of birth is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/address is required/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("rejects invalid email format", async () => {
    render(<ProfileSettings />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "not-an-email" }
    });

    expect(await screen.findByText(/enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("rejects future date of birth", async () => {
    render(<ProfileSettings />);

    fireEvent.change(screen.getByLabelText(/date of birth/i), {
      target: { value: "2999-01-01" }
    });

    expect(await screen.findByText(/date of birth cannot be in the future/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeDisabled();
  });

  it("supports keyboard-only password toggle", async () => {
    render(<ProfileSettings />);

    const passwordInput = screen.getByLabelText(/^Password$/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button", { name: /show password/i });
    toggleButton.focus();

    await userEvent.keyboard("{Enter}");
    expect(passwordInput).toHaveAttribute("type", "text");

    await userEvent.keyboard(" ");
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
