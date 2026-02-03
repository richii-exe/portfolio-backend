import { useProgress } from '@react-three/drei'

const LoadingScreen = () => {
    const { progress, active } = useProgress()

    if (!active) return null

    return (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-white">
            <div className="text-4xl font-bold tracking-widest mb-4">LOADING</div>
            <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-white transition-all duration-200 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="mt-2 text-sm text-gray-400 font-mono">{Math.round(progress)}%</div>
        </div>
    )
}

export default LoadingScreen
