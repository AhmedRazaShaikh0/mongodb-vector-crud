"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const baseUrl = "";

export default function PostData() {
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const ref3 = useRef<any>(null);
  const [data, setData] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(false);
  const [editingPostText, setEditingPostText] = useState("");
  const [updateIndex, setUpdateIndex] = useState(-1);
  const [settings, setSettings] = useState(null);

  const editPost = (index: number) => {
    setUpdate(true);
    setSettings(null);
    setUpdateIndex(index);
    setEditingPostText(data[index].text);
  };

  const toggleSettings = (id: any) => {
    if (settings === id) {
      setSettings(null);
    } else {
      setSettings(id);
    }
  };

  function autoResize(event: any) {
    event.target.style.height = "inherit"; // Reset height
    event.target.style.height = `${event.target.scrollHeight}px`; // Set to scrollHeight
  }

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      setLoading(true);

      const res = await axios.get(`${baseUrl}/api/v1/posts`);
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function searchData() {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/api/v1/search?q=${ref2.current.value}`
      );
      setData(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function PostData() {
    setIsOpen(false);
    try {
      setLoading(true);

      const PostedData = await axios.post(`${baseUrl}/api/v1/post`, {
        text: ref.current.value,
      });
      toast.success("Post has been published!");
      getData();
    } catch (error) {
      console.log(error);
    }
  }

  async function UpdateData(id: any) {
    setUpdate(false);
    try {
      setLoading(true);
      const UpdatedData = await axios.put(`${baseUrl}/api/v1/post/${id}`, {
        text: ref3.current.value,
      });
      toast.success("Post has been updated!");
      getData();
    } catch (error) {
      console.log(error);
    }
  }

  async function DeleteData(id: any) {
    setSettings(null);
    try {
      setLoading(true);
      const DeletedData = await axios.delete(`${baseUrl}/api/v1/post/${id}`);

      toast.success("Post has been deleted!");
      getData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  function handleSearch(event: any) {
    event.preventDefault();
    searchData();
  }

  return (
    <div className="bg-[#F0F2F5] p-4 overflow-y-scroll h-screen">
      <Toaster position="top-center" />
      {!search ? (
        <div
          onClick={() => setSearch(!search)}
          className="absolute top-5 right-5 cursor-pointer"
        >
          <img src="/search.png" alt="" width={30} height={30} />
        </div>
      ) : (
        <div
          onClick={() => setSearch(!search)}
          className="absolute top-5 right-5 cursor-pointer"
        >
          <img src="/close.png" alt="" width={30} height={30} />
        </div>
      )}
      <form
        action=""
        onSubmit={handleSearch}
        className={`m-auto transition-all duration-700 overflow-hidden max-w-3xl flex justify-center ${
          search ? "h-10" : "h-0"
        }`}
      >
        <input
          type="text"
          required
          ref={ref2}
          className="p-2 text-black rounded-full w-3/4"
          placeholder="Search Post"
        />
        <button
          type="submit"
          className=" bg-black text-white p-2 rounded-full font-bold"
        >
          Search
        </button>
      </form>
      <div className="bg-white py-3 px-4 max-w-2xl rounded-lg m-auto my-5 grid gap-3">
        <div className="flex gap-4">
          <img src="/dp.jpg" alt="" className="rounded-full" />
          <div
            onClick={() => {
              setIsOpen(true);
            }}
            id=""
            className="p-2 text-gray-700 rounded-full bg-[#F0F2F5] hover:bg-[#ebecee] w-full cursor-pointer"
          >
            What&apos;s on your mind, Ahmed?
          </div>
        </div>
        <div className="grid grid-flow-col border-t-[#F0F2F5] border-t pt-2">
          <button className="hover:bg-[#F0F2F5] flex justify-center gap-2 text-sm py-2 rounded-lg">
            <img src="/video.png" alt="" width={20} height={20} />
            Live Video
          </button>
          <button className="hover:bg-[#F0F2F5] flex justify-center gap-2 text-sm py-2 rounded-lg">
            <img src="/image.png" alt="" width={20} height={20} />
            Photo/Video
          </button>
          <button className="hover:bg-[#F0F2F5] flex justify-center gap-2 text-sm py-2 rounded-lg">
            <img src="/emoji.png" alt="" width={20} height={20} />
            Feeling/Activity
          </button>
        </div>
      </div>
      {loading ? (
        <div>
          <img
            src="/loading.svg"
            alt=""
            width={50}
            height={50}
            className="m-auto"
          />
        </div>
      ) : (
        data.map((item: any, index: number) => (
          <div
            className="bg-white py-3 px-4 max-w-2xl rounded-lg m-auto my-5"
            key={item._id}
          >
            <div className="flex justify-between items-center relative">
              <div className="flex gap-4 items-center">
                <img src="/dp.jpg" alt="" className="rounded-full" />
                <div>
                  <Link
                    href={"#"}
                    className="text-sm font-semibold hover:underline"
                  >
                    Ahmed Raza
                  </Link>
                  <div className="flex gap-2">
                    <h1 className="text-xs">16 h</h1>
                    <img src="" alt="" />
                  </div>
                </div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => toggleSettings(index)}
              >
                <img src="/settings.png" alt="" width={18} height={18} />
              </div>
              <div
                className={`absolute rounded-lg bg-white shadow-custom w-52 
                  ${
                    settings === index ? "h-32" : "h-0"
                  } overflow-hidden font-semibold text-xs transition-all duration-700 top-10 right-5`}
              >
                <div className="">
                  <h2 className="hover:bg-[#ebecee] px-3 py-2 cursor-pointer">
                    Save Post
                  </h2>
                  <h2
                    onClick={() => {
                      editPost(index);
                    }}
                    className="hover:bg-[#ebecee] px-3 py-2 cursor-pointer"
                  >
                    Edit Post
                  </h2>
                  <h2 className="hover:bg-[#ebecee] px-3 py-2 cursor-pointer">
                    Edit Audience
                  </h2>
                  <h2
                    onClick={() => DeleteData(item._id)}
                    className="hover:bg-[#ebecee] px-3 py-2 cursor-pointer"
                  >
                    Delete Post
                  </h2>
                </div>
              </div>
            </div>
            <div className="my-5">
              <h2 className="text-2xl">{item.text}</h2>
            </div>
            <div className="flex justify-between items-center my-2">
              <div className="flex justify-center cursor-pointer">
                <img
                  src="/postlike.svg"
                  alt=""
                  width={15}
                  height={15}
                  className="z-10"
                />
                <img
                  src="/postlove.svg"
                  alt=""
                  width={15}
                  height={15}
                  className="-translate-x-1"
                />
                <span className="text-gray-500 text-sm">6</span>
              </div>
              <div>
                <Link
                  href={"#"}
                  className="text-gray-500 text-sm hover:underline"
                >
                  2 comments
                </Link>
              </div>
            </div>
            <div className="flex gap-2 justify-around border-y border-gray-300 my-2 py-1 text-sm">
              <div className="flex gap-2 cursor-pointer w-full p-2 justify-center rounded-md hover:bg-[#ebecee]">
                <img src="/like.png" alt="" width={20} height={20} />
                Like
              </div>
              <div className="flex gap-2 cursor-pointer w-full p-2 justify-center rounded-md hover:bg-[#ebecee]">
                <img src="/comment.png" alt="" width={20} height={20} />
                Comment
              </div>
              <div className="flex gap-2 cursor-pointer w-full p-2 justify-center rounded-md hover:bg-[#ebecee]">
                <img src="/share.png" alt="" width={20} height={20} />
                Share
              </div>
            </div>

            {update && updateIndex === index && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#f4f4f496] z-20">
                <div className="bg-white p-4 rounded-lg shadow-lg w-[28rem] relative">
                  <h1 className="font-extrabold text-center pb-4 border-b border-b-gray-300">
                    Update Post
                  </h1>
                  <button
                    className="absolute top-3 right-3"
                    onClick={() => setUpdate(false)}
                  >
                    <img
                      src="/close.png"
                      alt=""
                      width={30}
                      height={30}
                      className="bg-[#F0F2F5] hover:bg-[#ebecee] p-1 rounded-full"
                    />
                  </button>
                  <div className="py-4 flex gap-4">
                    <img src="/dp.jpg" alt="" className="rounded-full" />
                    <div>
                      <h1 className="text-sm font-semibold">Ahmed Raza</h1>
                      <div className="bg-gray-300 flex justify-center gap-1 py-1 rounded-lg cursor-pointer">
                        <img
                          src="/users.png"
                          alt=""
                          width={10}
                          height={10}
                          className=" h-[10px] my-auto"
                        />
                        <span className="text-[10px] -translate-x font-semibold">
                          Friends
                        </span>
                        <img
                          src="/arrowdown.png"
                          alt=""
                          width={10}
                          height={10}
                          className=" h-3 my-auto"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <textarea
                      onChange={(e) => setEditingPostText(e.target.value)}
                      rows={4}
                      value={editingPostText}
                      ref={ref3}
                      placeholder="What's on your mind, Ahmed?"
                      className="text-xl resize-none w-full focus-visible:outline-none"
                    />
                  </div>
                  <div className="flex justify-between mb-4">
                    <img
                      src="/pallete.png"
                      alt=""
                      width={30}
                      height={30}
                      className="-translate-x-1 cursor-pointer"
                    />
                    <img
                      src="/happy.png"
                      alt=""
                      width={30}
                      height={30}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="p-4 border border-gray-300 flex justify-between items-center rounded-lg">
                    <h2 className="text-xs font-semibold cursor-pointer">
                      Add to your post
                    </h2>
                    <div className="flex gap-4">
                      <img
                        src="/image.png"
                        alt=""
                        width={22}
                        height={22}
                        className="cursor-pointer"
                      />
                      <img
                        src="/request.png"
                        alt=""
                        width={22}
                        height={22}
                        className="cursor-pointer"
                      />
                      <img
                        src="/emoji.png"
                        alt=""
                        width={22}
                        height={22}
                        className="cursor-pointer"
                      />
                      <img
                        src="/location.png"
                        alt=""
                        width={22}
                        height={22}
                        className="cursor-pointer"
                      />
                      <img
                        src="/gif.png"
                        alt=""
                        width={22}
                        height={22}
                        className="cursor-pointer"
                      />
                      <img
                        src="/dots.png"
                        alt=""
                        width={22}
                        height={22}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => UpdateData(item._id)}
                    className={`w-full bg-blue-700 text-white rounded-lg text-xs py-2 mt-4`}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#f4f4f496] z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-[28rem] relative">
            <h1 className="font-extrabold text-center pb-4 border-b border-b-gray-300">
              Create Post
            </h1>
            <button
              className="absolute top-3 right-3"
              onClick={() => setIsOpen(false)}
            >
              <img
                src="/close.png"
                alt=""
                width={30}
                height={30}
                className="bg-[#F0F2F5] hover:bg-[#ebecee] p-1 rounded-full"
              />
            </button>
            <div className="py-4 flex gap-4">
              <img src="/dp.jpg" alt="" className="rounded-full" />
              <div>
                <h1 className="text-sm font-semibold">Ahmed Raza</h1>
                <div className="bg-gray-300 flex justify-center gap-1 py-1 rounded-lg cursor-pointer">
                  <img
                    src="/users.png"
                    alt=""
                    width={10}
                    height={10}
                    className=" h-[10px] my-auto"
                  />
                  <span className="text-[10px] -translate-x font-semibold">
                    Friends
                  </span>
                  <img
                    src="/arrowdown.png"
                    alt=""
                    width={10}
                    height={10}
                    className=" h-3 my-auto"
                  />
                </div>
              </div>
            </div>
            <div>
              <textarea
                onInput={autoResize}
                rows={4}
                ref={ref}
                placeholder="What's on your mind, Ahmed?"
                className="text-xl resize-none w-full focus-visible:outline-none"
              />
            </div>
            <div className="flex justify-between mb-4">
              <img
                src="/pallete.png"
                alt=""
                width={30}
                height={30}
                className="-translate-x-1 cursor-pointer"
              />
              <img
                src="/happy.png"
                alt=""
                width={30}
                height={30}
                className="cursor-pointer"
              />
            </div>
            <div className="p-4 border border-gray-300 flex justify-between items-center rounded-lg">
              <h2 className="text-xs font-semibold cursor-pointer">
                Add to your post
              </h2>
              <div className="flex gap-4">
                <img
                  src="/image.png"
                  alt=""
                  width={22}
                  height={22}
                  className="cursor-pointer"
                />
                <img
                  src="/request.png"
                  alt=""
                  width={22}
                  height={22}
                  className="cursor-pointer"
                />
                <img
                  src="/emoji.png"
                  alt=""
                  width={22}
                  height={22}
                  className="cursor-pointer"
                />
                <img
                  src="/location.png"
                  alt=""
                  width={22}
                  height={22}
                  className="cursor-pointer"
                />
                <img
                  src="/gif.png"
                  alt=""
                  width={22}
                  height={22}
                  className="cursor-pointer"
                />
                <img
                  src="/dots.png"
                  alt=""
                  width={22}
                  height={22}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={PostData}
              className={`w-full bg-blue-700 text-white rounded-lg text-xs py-2 mt-4`}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
