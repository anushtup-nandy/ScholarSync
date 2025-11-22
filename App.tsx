import React, { useState, useEffect, useRef } from 'react';
import { ViewState, User, UserRole, ChatMessage } from './types';
import { MOCK_USERS, MOCK_POSTS, MOCK_OPPORTUNITIES } from './constants';
import { analyzeProfileMatch, getGeminiResponse, polishResearchPitch } from './services/geminiService';
import NetworkGraph from './components/NetworkGraph';
import { 
  Home, 
  Users, 
  Video, 
  ShoppingBag, 
  User as UserIcon, 
  Menu, 
  X, 
  Heart, 
  MessageCircle, 
  Send, 
  Sparkles,
  GraduationCap,
  Globe,
  Award,
  Check,
  Briefcase,
  Bot,
  Linkedin,
  Fingerprint,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// --- Helper Components ---

const SocialLinks: React.FC<{ links: User['socialLinks'] }> = ({ links }) => {
  if (!links) return null;
  
  return (
    <div className="flex gap-3 items-center mt-3">
      {links.linkedin && (
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors" title="LinkedIn">
          <Linkedin size={16} />
        </a>
      )}
      {links.googleScholar && (
        <a href={links.googleScholar} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors" title="Google Scholar">
          <GraduationCap size={16} />
        </a>
      )}
      {links.orcid && (
        <a href={`https://orcid.org/${links.orcid}`} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors" title="ORCID">
          <Fingerprint size={16} />
        </a>
      )}
      {links.website && (
        <a href={links.website} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors" title="Website">
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  );
};

// --- Components ---

// 1. Navigation / Layout
const NavBar: React.FC<{ currentView: ViewState, setView: (v: ViewState) => void, mobileMenuOpen: boolean, setMobileMenuOpen: (o: boolean) => void }> = ({ currentView, setView, mobileMenuOpen, setMobileMenuOpen }) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Home', icon: Home },
    { id: ViewState.MATCH, label: 'Match', icon: Users },
    { id: ViewState.FEED, label: 'Feed', icon: Video },
    { id: ViewState.MARKETPLACE, label: 'Market', icon: ShoppingBag },
    { id: ViewState.AI_ASSISTANT, label: 'Assistant', icon: Sparkles },
    { id: ViewState.PROFILE, label: 'Profile', icon: UserIcon },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col w-64 h-screen bg-notion-sidebar border-r border-notion-border fixed left-0 top-0 p-4 z-50">
        <div className="mb-8 flex items-center gap-2 px-2">
           <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold font-serif">SS</div>
           <h1 className="font-serif font-bold text-lg text-notion-text">ScholarSync</h1>
        </div>
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentView === item.id ? 'bg-notion-hover text-notion-text' : 'text-notion-gray hover:bg-notion-hover hover:text-notion-text'}`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-4 border-t border-notion-border">
           <p className="text-xs text-notion-gray px-2">"Connecting Minds"</p>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-notion-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-black rounded flex items-center justify-center text-white font-bold text-xs font-serif">SS</div>
           <span className="font-serif font-bold text-notion-text">ScholarSync</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-notion-text p-2">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-14 bg-white z-40 p-4 border-t border-notion-border"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setView(item.id); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${currentView === item.id ? 'bg-notion-sidebar text-black' : 'text-notion-gray'}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// 2. Dashboard View
const Dashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto pt-20 md:pt-10 pb-24">
      <header className="mb-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-notion-text mb-2">Welcome back, Scholar.</h2>
          <p className="text-notion-gray text-lg">Democratizing research, one connection at a time.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-6 bg-white border border-notion-border rounded-xl shadow-sm flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-notion-blue rounded-lg text-blue-600"><Users size={20} /></div>
            <span className="text-green-600 text-xs font-bold flex items-center gap-1">+12% <Check size={12}/></span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-notion-text">1,240</h3>
            <p className="text-sm text-notion-gray">Active Scholars</p>
          </div>
        </motion.div>

        {/* Stat Card 2 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="p-6 bg-white border border-notion-border rounded-xl shadow-sm flex flex-col justify-between h-40"
        >
          <div className="flex justify-between items-start">
            <div className="p-2 bg-notion-red rounded-lg text-red-600"><Briefcase size={20} /></div>
            <span className="text-green-600 text-xs font-bold flex items-center gap-1">+5 New</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-notion-text">85</h3>
            <p className="text-sm text-notion-gray">Open Grants</p>
          </div>
        </motion.div>
        
         {/* Stat Card 3 */}
         <motion.div 
          whileHover={{ y: -5 }}
          className="p-6 bg-white border border-notion-border rounded-xl shadow-sm flex flex-col justify-between h-40"
        >
           <div className="flex justify-between items-start">
            <div className="p-2 bg-notion-teal rounded-lg text-teal-600"><Award size={20} /></div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-notion-text">Top 5%</h3>
            <p className="text-sm text-notion-gray">Collaborator Score</p>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-12">
        <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
          <Globe size={18} className="text-notion-gray"/> Global Research Feed
        </h3>
        <div className="space-y-4">
          {MOCK_POSTS.map((post) => (
             <div key={post.id} className="flex gap-4 p-4 border border-notion-border rounded-lg bg-white hover:shadow-sm transition-shadow">
                <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover" />
                <div>
                   <p className="text-sm font-semibold text-notion-text">{post.authorName} <span className="text-notion-gray font-normal">shared a research snapshot</span></p>
                   <h4 className="font-serif font-medium mt-1">{post.title}</h4>
                   <p className="text-sm text-notion-gray mt-1 line-clamp-2">{post.description}</p>
                   <div className="flex gap-2 mt-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-notion-sidebar text-notion-gray rounded-full">#{tag}</span>
                      ))}
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Matching View (Tinder Style)
const Matchmaking: React.FC = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const profile = MOCK_USERS[currentProfileIndex];
  const currentUser = MOCK_USERS[1]; // Assume logged in as James

  const handleSwipe = (direction: 'left' | 'right') => {
    setAiAdvice(null);
    if (currentProfileIndex < MOCK_USERS.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      alert("No more profiles for now!");
      setCurrentProfileIndex(0);
    }
  };

  const getAiAdvice = async () => {
    if (!profile) return;
    setLoadingAi(true);
    const advice = await analyzeProfileMatch(currentUser, profile);
    setAiAdvice(advice);
    setLoadingAi(false);
  };

  if (!profile) return <div className="p-10 text-center">All caught up!</div>;

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden relative bg-white">
      <div className="pt-16 md:pt-6 pb-2 px-4 text-center shrink-0 flex justify-between items-center max-w-md mx-auto w-full">
        <h2 className="text-xl font-serif font-bold">Discover</h2>
        <button onClick={getAiAdvice} disabled={loadingAi} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors hover:bg-purple-200">
          <Sparkles size={12} className={loadingAi ? "animate-spin" : ""} /> AI Match
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-24 md:pb-8 overflow-hidden">
        <div className="w-full max-w-md h-full max-h-[650px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={profile.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ x: 300, opacity: 0, rotate: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-full h-full bg-white border border-notion-border rounded-3xl shadow-xl overflow-hidden flex flex-col absolute inset-0"
            >
              <div className="h-2/5 bg-gray-200 relative shrink-0">
                 <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12 text-white">
                   <h3 className="text-2xl font-bold leading-tight">{profile.name}</h3>
                   <p className="text-sm opacity-90">{profile.role} @ {profile.institution}</p>
                 </div>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto no-scrollbar flex flex-col">
                 {aiAdvice && (
                   <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg text-xs text-purple-800 shadow-sm shrink-0">
                     <span className="font-bold block mb-1 flex items-center gap-1"><Sparkles size={10}/> Gemini Analysis:</span>
                     {aiAdvice}
                   </motion.div>
                 )}

                 <div className="flex flex-wrap gap-2 mb-3 shrink-0">
                   {profile.interests.map(tag => (
                     <span key={tag} className="px-2 py-1 bg-notion-sidebar border border-notion-border rounded-md text-[10px] font-medium text-notion-text uppercase tracking-wide">{tag}</span>
                   ))}
                 </div>
                 
                 <SocialLinks links={profile.socialLinks} />
                 
                 <h4 className="text-xs font-bold text-notion-gray uppercase tracking-wide mt-4 mb-1">Bio</h4>
                 <p className="text-notion-text text-sm leading-relaxed mb-4">{profile.bio}</p>

                 <div className="mt-auto pt-4 border-t border-notion-border flex justify-around items-center shrink-0">
                    <div className="text-center">
                      <span className="block text-lg font-bold text-notion-text">{profile.collaboratorScore}</span>
                      <span className="text-[10px] text-notion-gray uppercase">Collab Score</span>
                    </div>
                    <div className="w-px h-8 bg-notion-border"></div>
                     <div className="text-center">
                      <span className="block text-lg font-bold text-notion-text">98%</span>
                      <span className="text-[10px] text-notion-gray uppercase">Response Rate</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-8 z-10 md:bottom-10">
         <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSwipe('left')} className="w-14 h-14 rounded-full bg-white border border-notion-border shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
           <X size={28} />
         </motion.button>
         <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleSwipe('right')} className="w-14 h-14 rounded-full bg-notion-text shadow-xl flex items-center justify-center text-white hover:bg-black transition-colors">
           <Heart size={28} fill="white" />
         </motion.button>
      </div>
    </div>
  );
};

// 4. AI Assistant (Chat)
const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am your research assistant. I can help you find grants, polish your abstracts, or suggest collaborators.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const contextPrompt = `You are an AI assistant within ScholarSync. Help the user (a researcher) with their query: "${input}"`;
    
    const responseText = await getGeminiResponse(contextPrompt);
    
    const modelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, modelMsg]);
    setIsThinking(false);
  };

  return (
    <div className="flex flex-col h-[100dvh] pt-14 md:pt-0 max-w-3xl mx-auto border-x border-notion-border bg-white relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map((msg) => (
           <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-1">
                   <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-notion-text text-white rounded-br-none' : 'bg-white border border-notion-border text-notion-text rounded-bl-none'}`}>
                 {msg.text}
              </div>
           </div>
         ))}
         {isThinking && (
           <div className="flex justify-start gap-2">
             <motion.div 
               animate={{ y: [0, -5, 0] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
               className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-1"
             >
                <Bot size={16} />
             </motion.div>
             <div className="bg-white p-3 rounded-xl rounded-bl-none border border-notion-border flex gap-1 items-center h-10">
               <span className="w-1.5 h-1.5 bg-notion-gray rounded-full animate-bounce"></span>
               <span className="w-1.5 h-1.5 bg-notion-gray rounded-full animate-bounce delay-100"></span>
               <span className="w-1.5 h-1.5 bg-notion-gray rounded-full animate-bounce delay-200"></span>
             </div>
           </div>
         )}
         <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 border-t border-notion-border bg-white shrink-0 safe-area-pb">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about grants, research summaries..."
            className="flex-1 border border-notion-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-notion-gray/20 bg-notion-sidebar"
          />
          <button onClick={handleSend} className="p-3 bg-notion-text text-white rounded-lg hover:opacity-90 transition-opacity">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Marketplace
const Marketplace: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto pt-20 md:pt-10 pb-24">
      <h2 className="text-3xl font-serif font-bold text-notion-text mb-6">Research Marketplace</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_OPPORTUNITIES.map((opp) => (
          <div key={opp.id} className="border border-notion-border rounded-lg p-5 bg-white hover:shadow-md transition-shadow cursor-pointer group">
             <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${opp.type === 'Grant' ? 'bg-green-100 text-green-700' : opp.type === 'Job' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                  {opp.type}
                </span>
                <span className="text-xs text-notion-gray">Due: {opp.deadline}</span>
             </div>
             <h3 className="font-bold text-lg text-notion-text group-hover:text-blue-600 transition-colors">{opp.title}</h3>
             <p className="text-sm text-notion-gray mb-3">{opp.institution}</p>
             
             {opp.amount && <p className="text-sm font-medium text-notion-text bg-notion-sidebar inline-block px-2 py-1 rounded mb-3">{opp.amount}</p>}

             <button className="w-full mt-2 py-2 border border-notion-border rounded hover:bg-notion-hover text-sm font-medium">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. Feed (TikTok style but vertical list for web simplicity, focused on content)
const Feed: React.FC = () => {
  const [newPostText, setNewPostText] = useState('');
  const [isPolishing, setIsPolishing] = useState(false);

  const handlePolish = async () => {
    if (!newPostText) return;
    setIsPolishing(true);
    const polished = await polishResearchPitch(newPostText);
    setNewPostText(polished);
    setIsPolishing(false);
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pt-20 md:pt-10 pb-24">
       {/* Create Post */}
       <div className="bg-white border border-notion-border rounded-xl p-4 mb-8 shadow-sm">
         <h3 className="text-sm font-bold text-notion-gray uppercase mb-2">Share Research Snapshot</h3>
         <textarea 
           value={newPostText}
           onChange={(e) => setNewPostText(e.target.value)}
           placeholder="What are you working on today?"
           className="w-full p-3 bg-notion-sidebar rounded-lg text-sm mb-3 focus:outline-none resize-none h-24"
         />
         <div className="flex justify-between items-center">
           <div className="flex gap-2">
              <button className="text-notion-gray hover:text-notion-text"><Video size={20}/></button>
              <button onClick={handlePolish} className={`text-purple-500 hover:text-purple-700 flex items-center gap-1 text-sm ${isPolishing ? 'animate-pulse' : ''}`}>
                 <Sparkles size={16}/> {isPolishing ? 'Polishing...' : 'AI Polish'}
              </button>
           </div>
           <button className="bg-notion-text text-white px-4 py-2 rounded-lg text-sm font-medium">Post</button>
         </div>
       </div>

       {/* Feed Items */}
       <div className="space-y-6">
          {MOCK_POSTS.map(post => (
            <div key={post.id} className="bg-white border border-notion-border rounded-xl overflow-hidden">
               <div className="p-4 flex items-center gap-3">
                  <img src={post.authorAvatar} className="w-8 h-8 rounded-full object-cover"/>
                  <div>
                    <p className="text-sm font-bold">{post.authorName}</p>
                    <p className="text-xs text-notion-gray">PhD Student @ Stanford</p>
                  </div>
               </div>
               
               {/* Simulated Video Area */}
               <div className="aspect-[4/5] bg-gray-900 flex items-center justify-center relative group cursor-pointer">
                  <p className="text-white/50 text-sm font-medium">Video Placeholder</p>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                       <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                     </div>
                  </div>
               </div>

               <div className="p-4">
                 <h4 className="font-bold text-lg mb-1">{post.title}</h4>
                 <p className="text-sm text-notion-text mb-3">{post.description}</p>
                 <div className="flex gap-4 text-notion-gray">
                    <button className="flex items-center gap-1 text-sm hover:text-red-500"><Heart size={18}/> {post.likes}</button>
                    <button className="flex items-center gap-1 text-sm hover:text-blue-500"><MessageCircle size={18}/> Comment</button>
                 </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  )
};

// 7. Profile
const Profile: React.FC = () => {
  const user = MOCK_USERS[1]; // Self
  const data = [
    { name: 'Jan', score: 600 },
    { name: 'Feb', score: 620 },
    { name: 'Mar', score: 680 },
    { name: 'Apr', score: 710 },
    { name: 'May', score: 750 },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto pt-20 md:pt-10 pb-24">
       <div className="flex flex-col md:flex-row gap-8 mb-8 items-start">
          <img src={user.avatar} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
          <div className="flex-1">
             <h2 className="text-3xl font-serif font-bold">{user.name}</h2>
             <p className="text-notion-gray text-lg mb-2">{user.role} at {user.institution}</p>
             <p className="text-sm text-notion-text max-w-xl leading-relaxed">{user.bio}</p>
             
             <SocialLinks links={user.socialLinks} />

             <div className="flex gap-2 mt-4">
               {user.interests.map(i => (
                 <span key={i} className="px-3 py-1 bg-notion-sidebar rounded-full text-xs font-medium border border-notion-border">{i}</span>
               ))}
             </div>
          </div>
          <div className="text-center bg-white p-4 border border-notion-border rounded-xl shadow-sm min-w-[150px]">
             <span className="block text-3xl font-bold text-notion-text">{user.collaboratorScore}</span>
             <span className="text-xs text-notion-gray uppercase tracking-wider">Reputation</span>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="p-4 border border-notion-border rounded-xl bg-white shadow-sm">
             <h3 className="text-sm font-bold text-notion-gray uppercase mb-4">Score History</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data}>
                      <XAxis dataKey="name" stroke="#9B9A97" fontSize={12} tickLine={false} axisLine={false}/>
                      <YAxis stroke="#9B9A97" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 50', 'dataMax + 50']}/>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #E0E0E0', boxShadow: '0px 4px 12px rgba(0,0,0,0.05)' }}
                      />
                      <Line type="monotone" dataKey="score" stroke="#37352F" strokeWidth={2} dot={{ r: 4, fill: '#37352F' }} activeDot={{ r: 6 }} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Network Graph */}
          <NetworkGraph centerUser={user} connections={[MOCK_USERS[0], MOCK_USERS[2], MOCK_USERS[3]]} />
       </div>
       
       <div className="mt-8">
         <h3 className="text-lg font-serif font-bold mb-4">Badges & Achievements</h3>
         <div className="flex gap-4 flex-wrap">
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-2 text-yellow-800 text-sm font-medium">
               <Award size={18}/> Top Contributor
            </div>
             <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2 text-blue-800 text-sm font-medium">
               <GraduationCap size={18}/> Mentor
            </div>
         </div>
       </div>
    </div>
  );
};

// Main App Shell
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderView = () => {
    switch (view) {
      case ViewState.DASHBOARD: return <Dashboard />;
      case ViewState.MATCH: return <Matchmaking />;
      case ViewState.FEED: return <Feed />;
      case ViewState.AI_ASSISTANT: return <AIAssistant />;
      case ViewState.MARKETPLACE: return <Marketplace />;
      case ViewState.PROFILE: return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-notion-bg text-notion-text font-sans selection:bg-notion-blue selection:text-blue-900">
      <NavBar 
        currentView={view} 
        setView={setView} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <main className="md:ml-64 min-h-screen relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;