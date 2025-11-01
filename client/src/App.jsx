import React, { useState } from 'react';
import MainMenu from './components/MainMenu.jsx';
import GameView from './components/GameView.jsx';
// (Sau này sẽ thêm Lobby, Leaderboard...)

// Định nghĩa các màn hình
const SCREENS = {
    MAIN_MENU: 'MAIN_MENU',
    LOBBY: 'LOBBY',
    GAME: 'GAME',
    LEADERBOARD: 'LEADERBOARD',
};

function App() {
    // State quản lý màn hình hiện tại
    const [screen, setScreen] = useState(SCREENS.MAIN_MENU);

    // Hàm dùng để chuyển màn hình
    const navigateTo = (targetScreen) => {
        setScreen(targetScreen);
    };

    // Render component tương ứng với màn hình
    const renderScreen = () => {
        switch (screen) {
            case SCREENS.MAIN_MENU:
                return <MainMenu navigateTo={navigateTo} SCREENS={SCREENS} />;

            case SCREENS.GAME:
                return <GameView navigateTo={navigateTo} SCREENS={SCREENS} />;

            // TODO: Thêm case cho LOBBY và LEADERBOARD
            // case SCREENS.LOBBY:
            //   return <Lobby navigateTo={navigateTo} SCREENS={SCREENS} />;

            default:
                return <MainMenu navigateTo={navigateTo} SCREENS={SCREENS} />;
        }
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            {renderScreen()}
        </div>
    );
}

export default App;
