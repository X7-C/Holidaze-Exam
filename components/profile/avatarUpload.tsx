import React, { useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { updateAvatar } from '../../services/profileService';
import { useAuth } from '../../hooks/useAuth';

interface AvatarUploadProps {
  currentAvatar?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleUpload = async () => {
    if (!file || !user) return;

    setLoading(true);
    try {
      await updateAvatar(user.name, file);
      window.location.reload();
    } catch (err) {
      setError('Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="text-center">
      <img 
        src={currentAvatar || 'https://placehold.co/150x150?text=Avatar'} 
        className="rounded-circle mb-3"
        width="150"
        height="150"
        alt="Profile"
      />
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button 
        onClick={handleUpload}
        disabled={!file || loading}
        className="mt-3"
      >
        {loading ? <Spinner size="sm" /> : 'Update Avatar'}
      </Button>
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </div>
  );
};

export default AvatarUpload;
