import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore'

export default function BlessingGuestbook() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'blessings'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      const items = []
      snap.forEach((doc) => items.push({ id: doc.id, ...doc.data() }))
      setList(items)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const trimmed = msg.trim()
    if (!trimmed) return
    await addDoc(collection(db, 'blessings'), {
      name: name.trim().slice(0, 20) || '匿名',
      msg: trimmed.slice(0, 240),
      createdAt: serverTimestamp(),
    })
    setMsg('')
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={submit} className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200"
            placeholder="你的名字（可留空）"
            value={name}
            onChange={(e)=>setName(e.target.value)}
          />
          <button className="px-6 py-3 rounded-xl bg-primary text-white shadow hover:shadow-md" type="submit">
            送上祝福
          </button>
        </div>
        <textarea
          className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-200"
          rows={3}
          placeholder="写下你的祝福（最多 240 字）"
          value={msg}
          onChange={(e)=>setMsg(e.target.value)}
        />
      </form>

      {loading ? (
        <p className="text-center text-gray-500">加载中…</p>
      ) : (
        <ul className="space-y-3">
          {list.map((b) => (
            <li key={b.id} className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow">
              <div className="text-sm text-gray-500">{b.name || '匿名'}</div>
              <div className="mt-1 text-gray-800 whitespace-pre-wrap">{b.msg}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
