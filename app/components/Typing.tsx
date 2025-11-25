export function Typing() {
    return (
        <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                style={{ animationDelay: '300ms' }}></div>
        </div>
    )
}