import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // Prevent caching

export default async function LostAndFoundPage() {
  const lostItems = await prisma.lostItem.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const missingCount = lostItems.filter(i => i.type === 'LOST' && i.status === 'OPEN').length;
  const foundCount = lostItems.filter(i => i.type === 'FOUND' && i.status === 'OPEN').length;

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-6 lg:px-24 pb-24">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-primary text-xs font-bold uppercase tracking-widest hover:underline mb-12 inline-block">
           &larr; Back to Orchestrator
        </Link>
        
        <header className="mb-16 border-b-[1px] border-border pb-8">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            AI <span className="text-primary">Matchmaker</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg">
            A smart registry for lost and found items. Report items to Anya, and she will actively scan and connect owners with their missing belongings.
          </p>
          <div className="flex gap-8 mt-8">
            <div className="border-[1px] border-primary bg-primary/5 p-4 w-40 text-center">
              <div className="text-3xl font-black text-primary">{missingCount}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Active Lost</div>
            </div>
            <div className="border-[1px] border-green-500 bg-green-950/20 p-4 w-40 text-center">
              <div className="text-3xl font-black text-green-500">{foundCount}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-2">Active Found</div>
            </div>
          </div>
        </header>

        {lostItems.length === 0 ? (
          <div className="text-center text-gray-500 py-12 border-[1px] border-border bg-surface">
            No items reported. Tell Anya if you've lost or found something.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lostItems.map(item => (
              <div key={item.id} className={`border-[1px] p-6 relative overflow-hidden transition-colors hover:bg-surface ${item.type === 'LOST' ? 'border-primary/50' : 'border-green-500/50'}`}>
                {/* Accent Corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rotate-45 ${item.type === 'LOST' ? 'bg-primary/20' : 'bg-green-500/20'}`}></div>
                
                <div className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${item.type === 'LOST' ? 'text-primary' : 'text-green-500'}`}>
                  {item.type} {item.status === 'MATCHED' && ' (RESOLVED)'}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{item.item}</h3>
                <p className="text-sm text-gray-400 mb-6">Location: {item.location}</p>
                
                <div className="text-xs text-gray-500 font-mono">
                  ID: {item.id.substring(0,8).toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
