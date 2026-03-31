import './Avatar.css';

export function Avatar({ src, alt, fallback, size = 'md' }) {
  return (
    <div className={`avatar avatar-${size}`}>
      {src ? (
        <img src={src} alt={alt} className="avatar-img" />
      ) : (
        <span className="avatar-fallback">{fallback || alt?.charAt(0)?.toUpperCase()}</span>
      )}
    </div>
  );
}