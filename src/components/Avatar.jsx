function Avatar({ name, size = 'md', color }) {
  const initial = name?.charAt(0)?.toUpperCase() || '?'

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-md',
    lg: 'w-12 h-12 text-lg',
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110`}
      style={{
        backgroundColor: color || `hsla(${Math.random() * 360}, 50%, 70%, 0.3)`,
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <span className="text-white font-medium">{initial}</span>
    </div>
  )
}

export default Avatar
