import { useEffect, useState } from 'react';
import UserNavbar from "../../Components/UserNavbar";
import UserSlidebar from "../../Components/UserSlidebar";
import "remixicon/fonts/remixicon.css";

const Challenges = () => {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  
  const challenges = [
    {
      title: "Array Manipulation Master",
      difficulty: "easy",
      points: 50,
      timeLimit: "30 mins",
      completions: 234,
      category: "Arrays"
    },
    {
      title: "Dynamic Programming Challenge",
      difficulty: "hard",
      points: 150,
      timeLimit: "60 mins",
      completions: 45,
      category: "DP"
    },
    {
      title: "Tree Traversal Quest",
      difficulty: "medium",
      points: 100,
      timeLimit: "45 mins",
      completions: 129,
      category: "Trees"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-yellow-50 min-h-screen flex flex-col">
      <UserNavbar page="Challenges" />
      <div className="p-4 flex-grow flex flex-col md:flex-row gap-4">
        <div>
          <UserSlidebar />
        </div>
        
        <main className="flex-grow p-4 md:p-6">
          {/* Header Section */}
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <h1 className="text-3xl font-black mb-4">Coding Challenges</h1>
            <p className="text-lg font-bold text-gray-700">
              Test your skills, earn rewards, and climb the leaderboard!
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-trophy-line text-2xl"></i>
                <div>
                  <p className="font-black">250+</p>
                  <p className="font-bold text-sm">Active Challenges</p>
                </div>
              </div>
              <div className="bg-purple-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-star-line text-2xl"></i>
                <div>
                  <p className="font-black">10,000+</p>
                  <p className="font-bold text-sm">Points Available</p>
                </div>
              </div>
              <div className="bg-orange-100 border-4 border-black p-4 flex items-center gap-3">
                <i className="ri-flashlight-line text-2xl"></i>
                <div>
                  <p className="font-black">5,000+</p>
                  <p className="font-bold text-sm">Active Developers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setSelectedDifficulty('all')}
                className={`px-4 py-2 font-bold border-2 border-black ${
                  selectedDifficulty === 'all' ? 'bg-black text-white' : 'bg-white'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setSelectedDifficulty('easy')}
                className={`px-4 py-2 font-bold border-2 border-black ${
                  selectedDifficulty === 'easy' ? 'bg-green-100' : 'bg-white'
                }`}
              >
                Easy
              </button>
              <button 
                onClick={() => setSelectedDifficulty('medium')}
                className={`px-4 py-2 font-bold border-2 border-black ${
                  selectedDifficulty === 'medium' ? 'bg-yellow-100' : 'bg-white'
                }`}
              >
                Medium
              </button>
              <button 
                onClick={() => setSelectedDifficulty('hard')}
                className={`px-4 py-2 font-bold border-2 border-black ${
                  selectedDifficulty === 'hard' ? 'bg-red-100' : 'bg-white'
                }`}
              >
                Hard
              </button>
            </div>
          </div>

          {/* Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 sm:mb-6">
            {challenges.map((challenge, index) => (
              <div 
                key={index}
                className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-black text-lg">{challenge.title}</h3>
                  <span className={`px-3 py-1 rounded-full font-bold ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <i className="ri-star-line"></i>
                    <span className="font-bold">{challenge.points} Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-time-line"></i>
                    <span className="font-bold">{challenge.timeLimit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-brain-line"></i>
                    <span className="font-bold">{challenge.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-book-2-line"></i>
                    <span className="font-bold">{challenge.completions} completions</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-blue-500 text-white font-bold py-2 px-4 border-2 border-black hover:bg-blue-600 transition-colors">
                  Start Challenge
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Challenges;