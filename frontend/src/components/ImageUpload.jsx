import React, { useState, useRef } from 'react';

const ImageUpload = ({ 
    onImagesChange, 
    multiple = false, 
    maxFiles = 1,
    existingImages = [],
    type = 'product' // 'product', 'profile', or 'verification'
}) => {
    const [images, setImages] = useState(existingImages);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (files) => {
        const validFiles = Array.from(files).slice(0, maxFiles - images.length);
        
        validFiles.forEach(file => {
            if (!file.type.startsWith('image/')) {
                alert('Please select only image files');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const newImage = {
                    file,
                    preview: e.target.result,
                    isNew: true
                };
                
                const updatedImages = multiple 
                    ? [...images, newImage]
                    : [newImage];
                
                setImages(updatedImages);
                onImagesChange(updatedImages);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileSelect(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const removeImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onImagesChange(updatedImages);
    };

    const getUploadText = () => {
        if (type === 'profile') return 'Upload Profile Picture';
        if (type === 'verification') return 'Upload Verification Documents';
        return multiple ? 'Upload Product Images' : 'Upload Product Image';
    };

    return (
        <div className="space-y-4">
            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className={`grid gap-4 ${
                    type === 'profile' ? 'grid-cols-1 max-w-xs' : 
                    'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={image.preview || image}
                                alt={`Upload ${index + 1}`}
                                className={`w-full h-32 object-cover rounded-lg border-2 border-gray-200 ${
                                    type === 'profile' ? 'rounded-full h-32 w-32' : ''
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                            {image.isNew && (
                                <span className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                    New
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Area */}
            {images.length < maxFiles && (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragging 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-300 hover:border-green-400'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="space-y-2">
                        <div className="text-gray-500">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">
                                {getUploadText()}
                            </p>
                            <p className="text-sm text-gray-500">
                                {multiple ? `Drag & drop up to ${maxFiles} images or click to browse` : 'Drag & drop or click to browse'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                PNG, JPG, JPEG up to 5MB each
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                multiple={multiple}
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
            />
        </div>
    );
};

export default ImageUpload;