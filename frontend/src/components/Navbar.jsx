import React from "react";
import {Link} from "react-router"

const Navbar = () => {
    return (
        <header className="bg-base-300 border-b border-base-content/10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-xl font-bold text-primary">WishperWall</h1> 
                    <Link to={"/create"} className="btn btn-primary">
                        Create Note
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
