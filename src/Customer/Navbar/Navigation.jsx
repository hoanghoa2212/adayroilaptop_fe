import { Fragment, useEffect, useState } from "react";
import { Dialog, Popover, Tab, Transition } from "@headlessui/react";
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    ShoppingBagIcon,
    XMarkIcon,
    PhotoIcon
} from "@heroicons/react/24/outline";
import image_centered_icon from '../../image_centered_icon.png';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem, TextField } from "@mui/material";
import { navigation } from "../../Config/navigationMenu.js";
import AuthModal from "../Auth/AuthModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { deepPurple } from "@mui/material/colors";
import { getUser, logout } from "../../Redux/Auth/Action.js";
import { getCart } from "../../Redux/Customers/Cart/Action.js";
import './index.css'
import SearchImage from "../SearchImage/SearchImage";

import ChatIcon from "../Chat/ChatIcon.jsx";
import ChatWindow from "../Chat/ChatWindow.jsx";
import api from "../../Config/api.js";
import { setActiveConversation, getMessages, resetUnreadCount } from "../../Redux/Chat/Action.js";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth, cart, chat } = useSelector((store) => store);
    const [openAuthModal, setOpenAuthModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const openUserMenu = Boolean(anchorEl);
    const jwt = localStorage.getItem("jwt");
    const location = useLocation();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        if (jwt) {
            dispatch(getUser(jwt));
            dispatch(getCart(jwt));
        }
    }, [jwt]);

    useEffect(() => {
        if (jwt && auth.user && !adminInfo) {
            const fetchAdminInfo = async () => {
                try {
                    const { data } = await api.get('/api/users/admin');
                    setAdminInfo(data);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchAdminInfo();
        }
    }, [jwt, auth.user, adminInfo]);

    const handleOpenChat = async () => {
        if (!auth.user) {
            alert("Bạn cần đăng nhập để sử dụng tính năng chat.");
            return;
        }

        if (!adminInfo) {
            alert("Không thể kết nối đến admin. Vui lòng thử lại sau.");
            return;
        }

        setIsChatOpen(true);
        dispatch(resetUnreadCount());

        try {
            const { data: conversation } = await api.get(`/api/conversations/with/${adminInfo.id}`);

            dispatch(setActiveConversation(conversation));
            dispatch(getMessages(conversation.id));

        } catch (error) {
            console.error(error);
        }
    };

    const handleCloseChat = () => {
        setIsChatOpen(false);
        dispatch(setActiveConversation(null));
    };

    const handleUserClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseUserMenu = (event) => {
        setAnchorEl(null);
    };

    const handleOpen = () => {
        setOpenAuthModal(true);
    };
    const handleClose = () => {
        setOpenAuthModal(false);
    };

    const handleCategoryClick = (category, section, item, close) => {
        navigate(`/${category.id}/${section.id}/${item.id}`);
        close();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            navigate(`/laptops/search?search=${inputValue}`);
        }
    };

    useEffect(() => {
        if (auth.user) {
            handleClose();
        }
        if (location.pathname === "/login" || location.pathname === "/signup") {
            navigate(-1);
        }
    }, [auth.user]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        handleCloseUserMenu();
        dispatch(logout());
    };
    const handleMyOrderClick = () => {
        handleCloseUserMenu();
        navigate("/account/order");
    };

    const handleAdminClick = () => {
        handleCloseUserMenu();
        navigate("/admin")
    };

    return (
        <div className="bg-white pb-6">
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-40 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel
                                className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                                <div className="flex px-4 pb-2 pt-5">
                                    <button
                                        type="button"
                                        className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <Tab.Group as="div" className="mt-2">
                                    <div className="border-b border-gray-200">
                                        <Tab.List className="-mb-px flex space-x-8 px-4">
                                            {navigation.categories.map((category) => (
                                                <Tab
                                                    key={category.name}
                                                    className={({ selected }) =>
                                                        classNames(
                                                            selected
                                                                ? "border-indigo-600 text-indigo-600"
                                                                : "border-transparent text-gray-900",
                                                            "flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium border-none"
                                                        )
                                                    }
                                                >
                                                    {category.name}
                                                </Tab>
                                            ))}
                                        </Tab.List>
                                    </div>
                                    <Tab.Panels as={Fragment}>
                                        {navigation?.categories?.map((category) => (
                                            <Tab.Panel
                                                key={category.name}
                                                className="space-y-10 px-4 pb-8 pt-10"
                                            >
                                                <div className="grid grid-cols-2 gap-x-4">
                                                    {category.featured.map((item) => (
                                                        <div
                                                            key={item.name}
                                                            className="group relative text-sm"
                                                        >
                                                            <div
                                                                className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">
                                                                <img
                                                                    src={item.imageSrc}
                                                                    alt={item.imageAlt}
                                                                    className="object-cover object-center"
                                                                />
                                                            </div>
                                                            <a
                                                                href={item.href}
                                                                className="mt-6 block font-medium text-gray-900"
                                                            >
                                                                <span
                                                                    className="absolute inset-0 z-10"
                                                                    aria-hidden="true"
                                                                />
                                                                {item.name}
                                                            </a>
                                                            <p aria-hidden="true" className="mt-1">
                                                                Shop now
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {category.sections.map((section) => (
                                                    <div key={section.name}>
                                                        <p
                                                            id={`${category.id}-${section.id}-heading-mobile`}
                                                            className="font-medium text-gray-900"
                                                        >
                                                            {section.name}
                                                        </p>
                                                        <ul
                                                            role="list"
                                                            aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                                                            className="mt-6 flex flex-col space-y-6"
                                                        >
                                                            {section.items.map((item) => (
                                                                <li key={item.name} className="flow-root">
                                                                    <p className="-m-2 block p-2 text-gray-500">
                                                                        {"item.name"}
                                                                    </p>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </Tab.Panel>
                                        ))}
                                    </Tab.Panels>
                                </Tab.Group>

                                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                    {navigation.pages.map((page) => (
                                        <div key={page.name} className="flow-root">
                                            <a
                                                href={page.href}
                                                className="-m-2 block p-2 font-medium text-gray-900"
                                            >
                                                {page.name}
                                            </a>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                                    <div className="flow-root">
                                        <a
                                            href="/public"
                                            className="-m-2 block p-2 font-medium text-gray-900"
                                        >
                                            Sign in
                                        </a>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 px-4 py-6">
                                    <a href="/public" className="-m-2 flex items-center p-2">
                                        <img
                                            src="https://tailwindui.com/img/flags/flag-canada.svg"
                                            alt=""
                                            className="block h-auto w-5 flex-shrink-0"
                                        />
                                        <span className="ml-3 block text-base font-medium text-gray-900">
                                            CAD
                                        </span>
                                        <span className="sr-only">, change currency</span>
                                    </a>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <header className={`${isScrolled ? "fixed animation-slide-down w-full" : "relative"} z-50 bg-white`}>

                <nav aria-label="Top" className="mx-auto">
                    <div className="border-b border-gray-200">
                        <div className="flex h-16 items-center justify-between px-11">
                            <button
                                type="button"
                                className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
                                onClick={() => setOpen(true)}
                            >
                                <span className="sr-only">Open menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="ml-4 flex lg:ml-0">
                                <Link to="/">
                                    <span className="sr-only">Your Company</span>
                                    <img
                                        src={image_centered_icon}
                                        alt="Laptop Shop icon"
                                        className="h-12 w-auto"
                                    />
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        className="w-[50vw] max-w-2xl bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
                                        placeholder="Search"
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        onClick={() => navigate(`/laptops/search?search`)}
                                        className="ml-2 p-2 text-gray-400 hover:text-gray-600"
                                    >
                                        <PhotoIcon className="h-6 w-6" />
                                    </button>
                                </div>

                            </div>

                            <div className="flex items-center">
                                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                                    {auth?.user ? (
                                        <div>
                                            <Avatar
                                                className="text-white"
                                                onClick={handleUserClick}
                                                aria-controls={open ? "basic-menu" : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? "true" : undefined}
                                                sx={{
                                                    bgcolor: deepPurple[500],
                                                    color: "white",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {auth.user?.name[0].toUpperCase()}
                                            </Avatar>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={openUserMenu}
                                                onClose={handleCloseUserMenu}
                                                MenuListProps={{
                                                    "aria-labelledby": "basic-button",
                                                }}
                                            >{auth.user?.role === "ADMIN"&&
                                                <MenuItem onClick={handleAdminClick}>
                                                    Trang quản trị
                                                </MenuItem>}
                                                <MenuItem onClick={handleMyOrderClick}>
                                                    Quản lý đơn hàng
                                                </MenuItem>
                                                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                                            </Menu>
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={handleOpen}
                                            className="text-sm font-medium text-gray-700 hover:text-gray-800"
                                        >
                                            Đăng nhập
                                        </Button>
                                    )}
                                </div>

                                <div className="ml-4 flow-root lg:ml-6">
                                    <Button
                                        onClick={() => navigate("/cart")}
                                        className="group -m-2 flex items-center p-2"
                                    >
                                        <ShoppingBagIcon
                                            className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                        <span
                                            className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                            {cart.cart?.length || 0}
                                        </span>
                                        <span className="sr-only">items in cart, view bag</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <AuthModal handleClose={handleClose} open={openAuthModal} />

            {auth.user && <ChatIcon onClick={handleOpenChat} unreadCount={chat?.unreadCount || 0} />}

            <ChatWindow open={isChatOpen} handleClose={handleCloseChat} />
        </div>
    );
}