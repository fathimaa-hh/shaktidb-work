import { NavLink } from "react-router-dom";

function Sidebar() {
    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "Problems", path: "/problems", icon: "💻" },
        { name: "Contests", path: "/contests", icon: "🏆" },
        { name: "Activity", path: "/activity", icon: "📅" },
        { name: "Analytics", path: "/analytics", icon: "📈" },
        { name: "Achievements", path: "/achievements", icon: "🎖️" },
        { name: "Profile", path: "/profile", icon: "👤" },
    ];

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <h2>CodeQuest</h2>
                <p>Track. Improve. Achieve.</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        <span>{item.icon}</span>
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>CodeQuest v1.0</p>
            </div>

        </aside>
    );
}

export default Sidebar;