import React from 'react';
import ImageUpload from './ImageUpload';

const ImageUploadField = ({ label, name, value, onChange, error, ...props }) => {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label">
                    {label}
                </label>
            )}
            
            <ImageUpload
                onImagesChange={(images) => onChange({
                    target: {
                        name,
                        value: images
                    }
                })}
                existingImages={value || []}
                {...props}
            />
            
            {error && (
                <p className="form-error">{error}</p>
            )}
        </div>
    );
};

export default ImageUploadField;