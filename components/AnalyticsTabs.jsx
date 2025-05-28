// "use client";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import StockChart from "./StockChart";
// import NewsFeed from "./NewsFeed";
// import ChatRAG from "./ChatRAG";

// export default function AnalyticsTabs({ stock }) {
//   return (
//     <Tabs defaultValue="overview" className="w-full">
//       <TabsList className="mb-4">
//         <TabsTrigger value="overview">Overview</TabsTrigger>
//         <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
//         <TabsTrigger value="news">News</TabsTrigger>
//         <TabsTrigger value="chat">Ask AI</TabsTrigger>
//       </TabsList>
//       <TabsContent value="overview">
//         <div className="bg-white/90 rounded-2xl shadow-2xl p-6 mb-6">
//           <StockChart stock={stock} />
//         </div>
//       </TabsContent>
//       <TabsContent value="fundamentals">
//         <div className="bg-white/90 rounded-2xl shadow-2xl p-8">
//           {/* Example static data; fetch real data for production */}
//           <div className="text-lg mb-2 font-semibold text-[#131D3B]">{stock.symbol} Fundamentals</div>
//           <div>EPS: $5.21<br />P/E Ratio: 28.4<br />Market Cap: $2.4T<br />Dividend Yield: 0.58%</div>
//         </div>
//       </TabsContent>
//       <TabsContent value="news">
//         <NewsFeed stock={stock} />
//       </TabsContent>
//       <TabsContent value="chat">
//         <ChatRAG stock={stock} />
//       </TabsContent>
//     </Tabs>
//   );
// }

"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StockChart from "./StockChart";
import NewsFeed from "./NewsFeed";
import ChatRAG from "./ChatRAG";
import Fundamentals from "./Fundamentals";

export default function AnalyticsTabs({ stock }) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="mb-4 bg-white dark:bg-darkcard rounded-xl shadow-card">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
        <TabsTrigger value="news">News</TabsTrigger>
        <TabsTrigger value="chat">Ask AI</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="bg-card dark:bg-darkcard rounded-2xl shadow-card p-6 mb-6">
          <StockChart stock={stock} />
        </div>
      </TabsContent>
      <TabsContent value="fundamentals">
        <Fundamentals stock={stock} />
      </TabsContent>
      <TabsContent value="news">
        <NewsFeed stock={stock} />
      </TabsContent>
      <TabsContent value="chat">
        <ChatRAG stock={stock} />
      </TabsContent>
    </Tabs>
  );
}
