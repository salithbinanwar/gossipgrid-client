;<div
  key={msg.id}
  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
>
  <div
    className={`max-w-[85%] md:max-w-[75%] p-3 rounded-2xl
                        ${
                          msg.role === 'user'
                            ? 'bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-tr-none'
                            : 'bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-tl-none'
                        }
                        transform hover:scale-[1.02] transition-transform duration-200
                        animate-quickFade`}
  >
    <div className="text-xs text-gray-400 mb-1">
      {msg.username || 'Anonymous'}
    </div>
    <p className="text-white/90 whitespace-pre-wrap text-sm md:text-base">
      {msg.content}
    </p>
  </div>
</div>
