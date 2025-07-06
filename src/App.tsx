import { useState, useRef, useEffect } from 'react'

interface NPC {
  id: number
  name: string
  biggestWish: string
  wishFulfilled: boolean
}

const initialNPCs: NPC[] = [
  { id: 1, name: 'Luna', biggestWish: 'To be free from her curse', wishFulfilled: false },
  { id: 2, name: 'Mira', biggestWish: 'To find true love', wishFulfilled: false },
  { id: 3, name: 'Selene', biggestWish: 'To see the stars one last time', wishFulfilled: false },
]

function PixelNpc({ happy }: { happy: boolean }) {
  // Simple pixel art: kneeling girl, happy face if happy
  return (
    <svg width="64" height="64" viewBox="0 0 32 32" className="mb-2" style={{imageRendering:'pixelated'}}>
      {/* Body */}
      <rect x="13" y="18" width="6" height="8" fill="#eabfb9" />
      {/* Knees */}
      <rect x="12" y="26" width="2" height="4" fill="#eabfb9" />
      <rect x="18" y="26" width="2" height="4" fill="#eabfb9" />
      {/* Dress */}
      <rect x="12" y="22" width="8" height="6" fill="#a3a3ff" />
      {/* Head */}
      <rect x="13" y="12" width="6" height="6" fill="#ffe0c1" />
      {/* Eyes */}
      <rect x="15" y="15" width="1" height="1" fill="#222" />
      <rect x="18" y="15" width="1" height="1" fill="#222" />
      {/* Smile or happy face */}
      {happy ? (
        <rect x="16" y="17" width="2" height="1" fill="#e35d6a" />
      ) : (
        <rect x="16" y="17" width="2" height="1" fill="#222" />
      )}
      {/* Hair */}
      <rect x="13" y="12" width="6" height="2" fill="#a86b3c" />
    </svg>
  )
}

function PixelKnife({ angle = 0 }: { angle: number }) {
  // Simple pixel art kitchen knife, rotatable
  return (
    <svg width="64" height="24" viewBox="0 0 32 12" style={{ transform: `rotate(${angle}deg)`, imageRendering:'pixelated', transition: 'transform 0.2s' }}>
      {/* Blade */}
      <rect x="2" y="5" width="20" height="2" fill="#e0e0e0" stroke="#aaa" strokeWidth="0.5" />
      {/* Tip */}
      <rect x="22" y="5" width="6" height="2" fill="#b0b0b0" />
      {/* Handle */}
      <rect x="-2" y="4" width="4" height="4" fill="#7c4a03" />
      {/* Bolster */}
      <rect x="2" y="4" width="1" height="4" fill="#c2b280" />
    </svg>
  )
}

function App() {
  const [npcs, setNpcs] = useState<NPC[]>(initialNPCs)
  const [stabbingId, setStabbingId] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [knifeAngle, setKnifeAngle] = useState<{ [id: number]: number }>({})
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startStabbing = (id: number) => {
    if (stabbingId !== id) {
      setStabbingId(id)
      setProgress(0)
    }
  }

  const stopStabbing = () => {
    setStabbingId(null)
    setProgress(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (stabbingId !== null) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            fulfillWish(stabbingId)
            stopStabbing()
            return 0
          }
          return prev + 1
        })
      }, 50)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [stabbingId])

  const fulfillWish = (id: number) => {
    setNpcs((prev) =>
      prev.map((npc) =>
        npc.id === id ? { ...npc, wishFulfilled: true } : npc
      )
    )
  }

  const handleAngleChange = (id: number, value: number) => {
    setKnifeAngle((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-yellow-50 to-yellow-100 text-gray-900 flex flex-col items-center p-6 font-mono">
      <h1 className="text-4xl font-extrabold mb-8 text-yellow-900 drop-shadow-md pixel-font">Pixel Wish Game</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {npcs.map((npc) => (
          <div
            key={npc.id}
            className={`bg-white border-4 border-yellow-300 rounded-lg p-6 shadow-xl flex flex-col justify-between items-center transition-transform transform hover:scale-105 relative pixel-art-box`}
            style={{ boxShadow: '0 0 0 4px #eab308, 0 8px 24px #eab30833' }}
          >
            <PixelNpc happy={npc.wishFulfilled} />
            <h2 className="text-xl font-bold mb-1 pixel-font">{npc.name}</h2>
            <p className="mb-2 italic text-gray-700 text-center text-sm">"{npc.biggestWish}"</p>
            {/* Pixel art knife with adjustable angle */}
            <div className="flex flex-col items-center mb-2">
              <PixelKnife angle={knifeAngle[npc.id] || 0} />
              <div className="flex items-center mt-1">
                <span className="text-xs mr-2">Winkel:</span>
                <input
                  type="range"
                  min={-90}
                  max={90}
                  value={knifeAngle[npc.id] || 0}
                  onChange={e => handleAngleChange(npc.id, Number(e.target.value))}
                  className="accent-yellow-500 w-24"
                  disabled={npc.wishFulfilled}
                />
                <span className="text-xs ml-2 w-8 text-right">{knifeAngle[npc.id] || 0}°</span>
              </div>
            </div>
            {npc.wishFulfilled ? (
              <p className="text-green-600 font-bold mt-2">Wish fulfilled! She has been freed.</p>
            ) : (
              <>
                <button
                  onMouseDown={() => startStabbing(npc.id)}
                  onMouseUp={stopStabbing}
                  onMouseLeave={stopStabbing}
                  onTouchStart={() => startStabbing(npc.id)}
                  onTouchEnd={stopStabbing}
                  className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors rounded px-4 py-2 font-semibold text-white mt-2 pixel-font border-2 border-red-900 shadow"
                >
                  Fulfill Wish (Stab Slowly)
                </button>
                <div className="w-full bg-gray-300 rounded h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-red-600 h-2 transition-all"
                    style={{ width: `${stabbingId === npc.id ? progress : 0}%` }}
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
