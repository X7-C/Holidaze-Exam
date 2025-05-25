import { apiRequest } from './api';

export const updateProfile = async (
  name: string,
  profileData: {
    avatar?: {
      url: string;
      alt?: string;
    };
    banner?: {
      url: string;
      alt?: string;
    };
    bio?: string;
    venueManager?: boolean;
  }
) => {
  const response = await apiRequest(
    `/holidaze/profiles/${name}`,
    {
      method: 'PUT',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    true
  );

  if (response.error) {
    throw new Error(response.error.message || 'Profile update failed');
  }

  return response.data;
};

export const updateAvatar = async (name: string, file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiRequest(
    `/holidaze/profiles/${name}/media`,
    {
      method: 'PUT',
      body: formData
    },
    true
  );

  if (response.error) {
    throw new Error(response.error.message || 'Avatar upload failed');
  }

  return response.data;
};
