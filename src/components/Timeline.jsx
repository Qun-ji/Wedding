import { timeline } from '../data/timelineData'

export default function Timeline() {
  return (
    <ol className="relative border-l-2 border-rose-200 max-w-3xl mx-auto">
      {timeline.map((item, idx) => (
        <li key={idx} className="mb-10 ml-6">
          <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-rose-300 rounded-full ring-8 ring-rose-100" />
          <h3 className="font-semibold text-lg">{item.title}
            <span className="ml-2 text-sm text-gray-500">{item.date}</span>
          </h3>
          <p className="text-gray-600 mt-2">{item.text}</p>
          {item.img && (
            <img src={item.img} alt={item.title} className="mt-4 w-full rounded-2xl shadow" />
          )}
        </li>
      ))}
    </ol>
  )
}
