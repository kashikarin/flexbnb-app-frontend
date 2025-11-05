export function UserImageCircle({ imageUrl = null, name, father }){
    return(
        imageUrl ? (
            <img
                src={imageUrl}
                alt={name}
                className={father === 'dashboard' ? 'guest-image' : ''}
            />
        ) : (
            <div className={`${father}-user-avatar-placeholder`}>
                <span>
                    {(name || 'U').charAt(0).toUpperCase()}
                </span>
            </div>
        )
    )
}