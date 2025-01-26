interface ProfileStatsProps {
    userData: {
        username: string;
        createdAt: Date;
        totalGamesPlayed: number;
        totalWins: number;
        categoryStats?: Map<
            string,
            {
            gamesPlayed: number;
            correctAnswers: number;
            winPercentage: number;
            }
        >;
        gameHistory?: {
            category: string;
            question: string;
            chosenOption: string;
            isCorrect: boolean;
            playedAt: Date;
        }[];
    };
}

export default function ProfileStats({ userData }: ProfileStatsProps) {
    if (!userData) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                {/* User Header */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">{userData.username}</h1>
                    <p className="text-gray-600">Member since {new Date(userData.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Overall Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Total Games</h3>
                        <p className="text-2xl text-blue-600">{userData.totalGamesPlayed}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Total Wins</h3>
                        <p className="text-2xl text-green-600">{userData.totalWins}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <h3 className="text-lg font-semibold text-gray-800">Win Rate</h3>
                        <p className="text-2xl text-purple-600">
                            {userData.totalGamesPlayed > 0
                                ? ((userData.totalWins / userData.totalGamesPlayed) * 100).toFixed(1)
                                : 0}%
                        </p>
                    </div>
                </div>

                {/* Category Stats */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Category Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userData.categoryStats
                            ? Object.entries(userData.categoryStats).map(([category, stats]) => (
                                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{category}</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <p>Games Played: {stats.gamesPlayed}</p>
                                        <p>Correct Answers: {stats.correctAnswers}</p>
                                        <p>Win Rate: {stats.winPercentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))
                            : <p className="text-gray-500">No category stats available.</p>}
                    </div>
                </div>

                {/* Recent Games */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Games</h2>
                    <div className="space-y-4">
                        {userData.gameHistory && userData.gameHistory.length > 0 ? (
                            userData.gameHistory.slice(0, 5).map((game, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{game.category}</h4>
                                            <p className="text-sm text-gray-600">{game.question}</p>
                                            <p className="text-sm text-gray-700">
                                                Answer: {game.chosenOption}
                                                <span className={game.isCorrect ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                                                    ({game.isCorrect ? 'Correct' : 'Incorrect'})
                                                </span>
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(game.playedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No recent games available.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
