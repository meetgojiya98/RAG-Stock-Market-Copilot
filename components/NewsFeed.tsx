export default function NewsFeed({ news }) {
  return (
    <div className="bg-white p-4 rounded shadow h-64 overflow-y-auto">
      <h2 className="font-bold text-red-700 mb-2">Latest News</h2>
      {news && news.length ? (
        news.map((item, idx) => (
          <div key={idx} className="mb-2">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700">
              {item.title}
            </a>
            <div className="text-xs text-gray-500">{item.source} | {item.publishedAt && item.publishedAt.slice(0, 10)}</div>
          </div>
        ))
      ) : (
        <div>No news available.</div>
      )}
    </div>
  );
}
