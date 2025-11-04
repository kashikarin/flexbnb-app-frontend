export function LoginFields({ credentials, isLoading, handleKeyDown, onInputChange }){

    return(
        <>
            <div className="input-group">
                <label>Email or Username</label>
                <input
                    type="text"
                    name="email"
                    value={credentials.email}
                    onChange={onInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter email or username"
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
        </>
    )
}
