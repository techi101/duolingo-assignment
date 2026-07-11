import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Pen, Plus, Search, Flame, Zap, Shield, Crown, Mail } from "lucide-react";
import { getUserProfile } from "@/db/queries";
import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";

const ProfilePage = async () => {
  const profile = await getUserProfile();

  if (!profile) {
    redirect("/courses");
  }

  const joinDate = profile.lastActiveDate 
    ? new Date(profile.lastActiveDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "July 2026";

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* Sticky right panel */}
      <StickyWrapper>
        <div className="rounded-2xl border-2 border-gray-100 overflow-hidden mb-6">
          <div className="flex border-b-2 border-gray-100">
            <div className="flex-1 py-4 text-center font-bold text-sm text-[#1CB0F6] border-b-2 border-[#1CB0F6] cursor-pointer">
              FOLLOWING
            </div>
            <div className="flex-1 py-4 text-center font-bold text-sm text-neutral-400 hover:bg-gray-50 cursor-pointer">
              FOLLOWERS
            </div>
          </div>
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-48 h-32 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-neutral-300">
              <Search className="w-10 h-10" />
            </div>
            <p className="text-neutral-500 font-medium text-lg leading-snug">
              Learning is more fun and effective when you connect with others.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-gray-100 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-neutral-800 text-lg">
            Add friends
          </h3>
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-x-4">
              <div className="bg-gray-100 rounded-full p-3 group-hover:bg-gray-200 transition-colors">
                <Search className="w-6 h-6 text-neutral-400" />
              </div>
              <span className="font-bold text-neutral-700">Find friends</span>
            </div>
            <div className="text-neutral-400 font-bold group-hover:text-neutral-500 transition-colors">
              {'>'}
            </div>
          </div>
          <div className="h-[2px] w-full bg-gray-100" />
          <div className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-x-4">
              <div className="bg-gray-100 rounded-full p-3 group-hover:bg-gray-200 transition-colors">
                <Mail className="w-6 h-6 text-neutral-400" />
              </div>
              <span className="font-bold text-neutral-700">Invite friends</span>
            </div>
            <div className="text-neutral-400 font-bold group-hover:text-neutral-500 transition-colors">
              {'>'}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="mt-8 px-4 flex flex-wrap gap-x-4 gap-y-2 justify-center text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
          <Link href="#" className="hover:text-neutral-400 transition-colors">About</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">Blog</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">Store</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">Efficacy</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">Careers</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">Investors</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">Terms</Link>
          <Link href="#" className="hover:text-neutral-400 transition-colors">Privacy</Link>
        </div>
      </StickyWrapper>

      {/* Main feed */}
      <FeedWrapper>
        {/* Banner Area */}
        <div className="w-full relative mb-6">
          <div className="w-full h-[200px] bg-[#D8F1FF] rounded-2xl flex items-center justify-center relative">
            {/* Dashed Avatar Placeholder */}
            <div className="w-32 h-32 rounded-full border-[3px] border-dashed border-[#1CB0F6] flex items-center justify-center bg-[#84D8FF] relative">
              <Plus className="w-10 h-10 text-white stroke-[3]" />
            </div>
            
            <button className="absolute top-4 right-4 bg-white/50 hover:bg-white rounded-full p-2 transition-colors border-2 border-gray-200">
              <Pen className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex items-start justify-between mb-6 border-b-2 border-gray-100 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-neutral-800">{profile.username}</h1>
            <p className="text-neutral-500 font-medium">{profile.username.toLowerCase().replace(" ", "")}970605</p>
            <p className="text-neutral-500 font-medium mt-1">Joined {joinDate}</p>
            <div className="flex items-center gap-x-4 mt-3">
              <span className="text-[#1CB0F6] font-bold cursor-pointer hover:text-[#1899D6]">
                0 Following
              </span>
              <span className="text-[#1CB0F6] font-bold cursor-pointer hover:text-[#1899D6]">
                0 Followers
              </span>
            </div>
          </div>
          
          {/* Flags */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-8 relative rounded-md overflow-hidden border-2 border-gray-200">
              <Image src="/en.svg" alt="English" fill className="object-cover" />
            </div>
            {profile.activeCourse && (
              <div className="w-10 h-8 relative rounded-md overflow-hidden border-2 border-gray-200">
                <Image src={profile.activeCourse.imageSrc} alt={profile.activeCourse.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Statistics Section */}
        <div className="w-full">
          <h2 className="text-2xl font-bold text-neutral-800 mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Streak Stat */}
            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-start gap-x-4">
              <Flame className="w-8 h-8 text-[#FF9600] fill-[#FF9600] mt-1" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-800">{profile.streak}</span>
                <span className="text-sm font-medium text-neutral-500">Day streak</span>
              </div>
            </div>

            {/* Total XP Stat */}
            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-start gap-x-4">
              <Zap className="w-8 h-8 text-[#FFD900] fill-[#FFD900] mt-1" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-800">{profile.xp}</span>
                <span className="text-sm font-medium text-neutral-500">Total XP</span>
              </div>
            </div>
            
            {/* Current League Placeholder */}
            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-start gap-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                <Shield className="w-4 h-4 text-gray-400 fill-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-800">None</span>
                <span className="text-sm font-medium text-neutral-500">Current league</span>
              </div>
            </div>

            {/* Top 3 Finishes Placeholder */}
            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-start gap-x-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                <Crown className="w-4 h-4 text-gray-400 fill-gray-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-neutral-800">0</span>
                <span className="text-sm font-medium text-neutral-500">Top 3 finishes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="w-full mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-neutral-800">Achievements</h2>
            <Link href="#" className="text-[#1CB0F6] font-bold text-sm uppercase tracking-wider hover:text-[#1899D6]">
              View All
            </Link>
          </div>
          
          <div className="border-2 border-gray-200 rounded-2xl flex flex-col">
            {profile.achievements.map((ach, index) => {
              // Calculate progress
              let currentVal = 0;
              let targetVal = 1;
              if (ach.xp_threshold) {
                currentVal = profile.xp;
                targetVal = ach.xp_threshold;
              } else if (ach.streak_threshold) {
                currentVal = profile.streak;
                targetVal = ach.streak_threshold;
              }
              const isEarned = currentVal >= targetVal;
              const pct = Math.min((currentVal / targetVal) * 100, 100);

              return (
                <div 
                  key={ach.id} 
                  className={`p-6 flex items-center gap-x-6 ${index !== profile.achievements.length - 1 ? 'border-b-2 border-gray-200' : ''}`}
                >
                  {/* Achievement Icon */}
                  <div className="w-20 h-20 flex-shrink-0">
                    <Image src={ach.icon} alt={ach.title} width={80} height={80} className="w-full h-full object-contain" />
                  </div>
                  
                  {/* Achievement Details */}
                  <div className="flex-1 flex flex-col gap-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg text-neutral-800">{ach.title}</h3>
                      <span className="text-sm font-bold text-neutral-400">
                        {Math.min(currentVal, targetVal)}/{targetVal}
                      </span>
                    </div>
                    <Progress value={pct} className="h-3" />
                    <p className="text-neutral-500 text-sm font-medium mt-1">{ach.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </FeedWrapper>
    </div>
  );
};

export default ProfilePage;
