
import React from 'react'
import { BiHomeCircle, BiUser } from 'react-icons/bi'
import { HiOutlineHashtag } from 'react-icons/hi'
import { BsBell, BsBookmark, BsEnvelope, BsThreeDots, BsTwitter } from "react-icons/bs"
import Link from 'next/link'

type Props = {}

const NAVIGATION_ITEMS = [
    {
        title: 'Twitter',
        icon: BsTwitter
    },
    {
        title: 'Home',
        icon: BiHomeCircle
    },
    {
        title: 'Explore',
        icon: HiOutlineHashtag
    },
    {
        title: 'Notifications',
        icon: BsBell
    },
    {
        title: 'Messages',
        icon: BsEnvelope
    },
    {
        title: 'Bookmarks',
        icon: BsBookmark
    },
    {
        title: 'Profile',
        icon: BiUser
    }
]

const LeftSideBar = (props: Props) => {
    return (
        <section className='fixed w-[275px] flex flex-col h-screen  text-white items-stretch'>
            <div className='flex flex-col items-stretch space-y-4 mt-4 h-full'>
                {
                    NAVIGATION_ITEMS.map((item) =>
                        <Link className='hover:bg-white/10 text-2xl transition duration-200 rounded-3xl py-2 px-6 flex items-center 
                    justify-start space-x-4 w-fit'
                            href={`/${item.title.toLowerCase()}`} key={item.title}>
                            <div>
                                <item.icon />
                            </div>
                            {
                                item.title !== 'Twitter' &&
                                <div>
                                    {item.title}
                                </div>
                            }
                        </Link>

                    )
                }
                <button className='w-full rounded-full bg-primary p-4 text-2xl text-center hover:bg-opacity-70 
            transition duration-200 m-4'>
                    Tweet
                </button>
            </div>
            <button className='rounded-full flex items-center space-x-2 m-4 bg-transparent p-4 text-center 
        hover:bg-white/20 transition duration-200 w-full'>
                <div className='flex items-center space-x-2'>
                    <div className='rounded-full bg-slate-400 w-12 h-12' />
                    <div className='text-left text-sm'>
                        <div className='font-semibold'>Club of Coders</div>
                        <div>@clubofcoderscom</div>
                    </div>
                </div>
                <div>
                    <BsThreeDots />
                </div>
            </button>
        </section>
    )
}

export default LeftSideBar