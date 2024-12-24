import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";

const Achievements = () => {
  // Sample achievement data
  const stats = {
    totalPoints: 2750,
    completedChallenges: 47,
    currentStreak: 5,
    rank: 124,
    level: 15
  };

  const achievements = [
    {
      title: "Algorithm Master",
      description: "Complete 10 algorithm challenges",
      progress: 7,
      total: 10,
      points: 500,
      icon: "ri-code-box-line",
      category: "Algorithms"
    },
    {
      title: "Consistency Champion",
      description: "Maintain a 7-day streak",
      progress: 5,
      total: 7,
      points: 300,
      icon: "ri-fire-line",
      category: "Engagement"
    },
    {
      title: "Bug Squasher",
      description: "Fix 15 debugging challenges",
      progress: 15,
      total: 15,
      points: 450,
      icon: "ri-bug-line",
      category: "Debugging",
      completed: true
    }
  ];

  const recentRewards = [
    {
      title: "Data Structures Expert",
      points: 200,
      date: "2024-12-20",
      icon: "ri-database-2-line"
    },
    {
      title: "5 Day Streak",
      points: 150,
      date: "2024-12-19",
      icon: "ri-calendar-check-line"
    }
  ];

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar />
      <div className="p-4 flex-grow flex flex-col md:flex-row gap-4">
        <div>
          <UserSlidebar />
        </div>
        
        <main className="flex-grow p-4 md:p-6">
          {/* Stats Overview */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <h1 className="text-3xl font-black mb-6">Your Achievements</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-blue-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-star-line text-2xl"></i>
                <div>
                  <p className="font-black">{stats.totalPoints}</p>
                  <p className="font-bold text-sm">Total Points</p>
                </div>
              </div>
              <div className="bg-purple-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-trophy-line text-2xl"></i>
                <div>
                  <p className="font-black">{stats.completedChallenges}</p>
                  <p className="font-bold text-sm">Challenges</p>
                </div>
              </div>
              <div className="bg-orange-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-fire-line text-2xl"></i>
                <div>
                  <p className="font-black">{stats.currentStreak} days</p>
                  <p className="font-bold text-sm">Current Streak</p>
                </div>
              </div>
              <div className="bg-green-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-medal-line text-2xl"></i>
                <div>
                  <p className="font-black">#{stats.rank}</p>
                  <p className="font-bold text-sm">Global Rank</p>
                </div>
              </div>
              <div className="bg-pink-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-user-star-line text-2xl"></i>
                <div>
                  <p className="font-black">Level {stats.level}</p>
                  <p className="font-bold text-sm">Current Level</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Progress */}
            <div className="lg:col-span-2">
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
                <h2 className="text-2xl font-black mb-4">Achievement Progress</h2>
                <div className="space-y-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="border-4 border-black p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <i className={`${achievement.icon} text-2xl`}></i>
                          <div>
                            <h3 className="font-black">{achievement.title}</h3>
                            <p className="text-sm font-bold text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        <span className="font-bold text-blue-600">{achievement.points} pts</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-black">
                          <div 
                            className="bg-blue-500 rounded-full h-full"
                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-sm font-bold mt-1">
                          {achievement.progress} / {achievement.total} completed
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Rewards */}
            <div className="lg:col-span-1 mb-20">
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-2xl font-black mb-4">Recent Rewards</h2>
                <div className="space-y-4">
                  {recentRewards.map((reward, index) => (
                    <div key={index} className="border-4 border-black p-4 bg-yellow-50">
                      <div className="flex items-center gap-3">
                        <i className={`${reward.icon} text-2xl`}></i>
                        <div className="flex-grow">
                          <h3 className="font-bold">{reward.title}</h3>
                          <p className="text-sm text-gray-600 font-bold">
                            {new Date(reward.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="font-black text-blue-600">+{reward.points}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Achievements;