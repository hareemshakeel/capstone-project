import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as userApi from '../api/userApi';
import styles from './ProfileSettings.module.css';

const emptyAddress = {
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

const formatDateForInput = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.msg ||
    'Something went wrong. Please try again.'
  );
};

const formatDisplayDate = (value) => {
  if (!value) {
    return 'Not set';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const formatAddress = (address) => {
  if (!address) {
    return 'No address added yet.';
  }

  const parts = [address.street, address.city, address.state, address.zip, address.country].filter(
    Boolean
  );

  return parts.length > 0 ? parts.join(', ') : 'No address added yet.';
};

function ProfileSettings() {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    email: '',
    phone: '',
    dateOfBirth: '',
    address: emptyAddress,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setProfileForm({
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: formatDateForInput(user.dateOfBirth),
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zip: user.address?.zip || '',
        country: user.address?.country || '',
      },
    });
  }, [user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setProfileForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
      return;
    }

    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setSavingProfile(true);

    try {
      const payload = {
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        dateOfBirth: profileForm.dateOfBirth || null,
        address: {
          street: profileForm.address.street.trim(),
          city: profileForm.address.city.trim(),
          state: profileForm.address.state.trim(),
          zip: profileForm.address.zip.trim(),
          country: profileForm.address.country.trim(),
        },
      };

      const { user: updatedUser, message } = await userApi.updateProfile(payload);
      updateUser(updatedUser);
      setProfileMessage(message || 'Profile updated successfully.');
    } catch (error) {
      setProfileError(getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);

    try {
      const { message } = await userApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordMessage(message || 'Password updated successfully.');
    } catch (error) {
      setPasswordError(getErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <p className={styles.kicker}>Account</p>
          <h1>Profile settings</h1>
          <p>
            Update your email, phone number, password, date of birth, and address from a
            single place.
          </p>
        </div>
      </header>

      <div className={styles.layoutGrid}>
        <div className={styles.formColumn}>
          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Personal information</h2>
                <p>Keep your contact details current for account notifications and support.</p>
              </div>
            </div>

            {profileMessage && <p className={styles.success}>{profileMessage}</p>}
            {profileError && <p className={styles.error}>{profileError}</p>}

            <form className={styles.form} onSubmit={handleProfileSubmit}>
              <div className={styles.gridTwo}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="phone">Phone number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="dateOfBirth">Date of birth</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={profileForm.dateOfBirth}
                  onChange={handleProfileChange}
                />
              </div>

              <fieldset className={styles.addressFieldset}>
                <legend>Address</legend>
                <p className={styles.helperText}>Enter the address you want associated with your profile.</p>

                <div className={styles.fieldGroup}>
                  <label htmlFor="address.street">Street</label>
                  <input
                    id="address.street"
                    name="address.street"
                    type="text"
                    value={profileForm.address.street}
                    onChange={handleProfileChange}
                    placeholder="123 Main St"
                  />
                </div>

                <div className={styles.gridTwo}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="address.city">City</label>
                    <input
                      id="address.city"
                      name="address.city"
                      type="text"
                      value={profileForm.address.city}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="address.state">State / Province</label>
                    <input
                      id="address.state"
                      name="address.state"
                      type="text"
                      value={profileForm.address.state}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className={styles.gridTwo}>
                  <div className={styles.fieldGroup}>
                    <label htmlFor="address.zip">ZIP / Postal code</label>
                    <input
                      id="address.zip"
                      name="address.zip"
                      type="text"
                      value={profileForm.address.zip}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label htmlFor="address.country">Country</label>
                    <input
                      id="address.country"
                      name="address.country"
                      type="text"
                      value={profileForm.address.country}
                      onChange={handleProfileChange}
                      placeholder="United States"
                    />
                  </div>
                </div>
              </fieldset>

              <div className={styles.actionsRow}>
                <button type="submit" className={styles.primaryBtn} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Change password</h2>
                <p>Use a strong password that is different from your other accounts.</p>
              </div>
            </div>

            {passwordMessage && <p className={styles.success}>{passwordMessage}</p>}
            {passwordError && <p className={styles.error}>{passwordError}</p>}

            <form className={styles.form} onSubmit={handlePasswordSubmit}>
              <div className={styles.fieldGroup}>
                <label htmlFor="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className={styles.gridTwo}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="newPassword">New password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="confirmPassword">Confirm new password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className={styles.actionsRow}>
                <button type="submit" className={styles.secondaryBtn} disabled={savingPassword}>
                  {savingPassword ? 'Updating...' : 'Update password'}
                </button>
              </div>
            </form>
          </section>
        </div>

        <aside className={styles.summaryColumn}>
          <section className={styles.summaryCard}>
            <p className={styles.kicker}>Profile overview</p>
            <h2>{user?.email || 'Your account'}</h2>
            <dl className={styles.summaryList}>
              <div>
                <dt>Phone</dt>
                <dd>{user?.phone || 'Not set'}</dd>
              </div>
              <div>
                <dt>Date of birth</dt>
                <dd>{formatDisplayDate(user?.dateOfBirth)}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{formatAddress(user?.address)}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.tipsCard}>
            <h3>Before you save</h3>
            <p>
              Check that your email is correct, then update any other fields that changed.
              Password changes happen separately so you can confirm them safely.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ProfileSettings;
