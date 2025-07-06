import { useState } from 'react'

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

function App() {
  const [npcs, setNpcs] = useState<NPC[]>(initialNPCs)

  const fulfillWish = (id: number) => {
    setNpcs((prev) =>
      prev.map((npc) =>
        npc.id === id ? { ...npc, wishFulfilled: true } : npc
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 via-yellow-50 to-yellow-100 text-gray-900 flex flex-col items-center p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-yellow-900 drop-shadow-md">Fulfill the NPCs' Biggest Wish</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        {npcs.map((npc) => (
          <div
            key={npc.id}
            className={`bg-white rounded-lg p-6 shadow-xl flex flex-col justify-between transition-transform transform hover:scale-105 relative`}
          >
            <div className="flex flex-col items-center">
              {/* NPC kneeling pose simulated by an SVG or emoji for now */}
              <div className="mb-4 text-6xl select-none" aria-hidden="true">🙏</div>
              <h2 className="text-2xl font-semibold mb-2">{npc.name}</h2>
              <p className="mb-4 italic text-gray-600">"{npc.biggestWish}"</p>
              {npc.wishFulfilled ? (
                <p className="text-green-600 font-bold">Wish fulfilled! She has been freed.</p>
              ) : (
                <button
                  onClick={() => fulfillWish(npc.id)}
                  className="bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors rounded px-4 py-2 font-semibold text-white"
                >
                  Fulfill Wish (Stab)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App