import { Camera, Upload, User } from 'lucide-react'
import { useRef } from 'react'

export function SignupFields({ credentials, isUploadingImage, onImageSelect, handleKeyDown, onInputChange, isLoading }){
    const fileInputRef = useRef(null)
    
    return(
        <div className="signup-layout">
                      <div className="profile-image-section">
                        <div className="image-upload-container">
                          <div className="image-preview">
                            {credentials.imageUrl ? (
                              <img
                                src={credentials.imageUrl}
                                alt="Profile preview"
                                className="preview-image"
                              />
                            ) : (
                              <div className="image-placeholder">
                                <User size={40} />
                              </div>
                            )}

                            {isUploadingImage && (
                              <div className="upload-overlay">
                                <Upload className="spinning" size={20} />
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingImage || isLoading}
                            className="upload-btn"
                          >
                            <Camera size={16} />
                            {credentials.imageUrl ? 'Change' : 'Add Photo'}
                          </button>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onImageSelect}
                            style={{ display: 'none' }}
                          />
                        </div>
                        <p className="upload-hint">Optional</p>
                      </div>

                      <div className="form-fields">
                        <div className="input-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            name="fullname"
                            value={credentials.fullname}
                            onChange={onInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter full name"
                            disabled={isLoading}
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label>Username</label>
                          <input
                            type="text"
                            name="username"
                            value={credentials.username}
                            onChange={onInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter username"
                            disabled={isLoading}
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={onInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter email"
                            disabled={isLoading}
                            required
                          />
                        </div>

                        <div className="input-group">
                          <label>Password</label>
                          <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={onInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter password"
                            disabled={isLoading}
                            required
                          />
                        </div>
                      </div>
                    </div>
    )
}