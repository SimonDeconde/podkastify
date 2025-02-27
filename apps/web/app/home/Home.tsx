'use client';

export default function Home() {
  return (
    <section className="mx-auto px-4 py-24">
      <div className="mx-auto w-full text-center md:w-11/12  xl:w-9/12">
        <h1 className="mb-6 text-4xl font-extrabold leading-none tracking-normal md:text-6xl md:tracking-tight">
          Listen to{' '}
          <span className="w-full bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
            your Youtube videos
          </span>
          !
        </h1>
        <p className="my-8 px-0 text-lg md:text-xl lg:px-24">
          Automatically convert Youtube videos to audio and listen to them on
          any podcast app.
        </p>
        <div className="my-12 space-x-0 md:mb-8 md:space-x-2">
          <div className="flex flex-col items-center justify-center">
            <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-8 shadow-lg">
              <h1 className="mb-4 text-4xl font-bold text-white">
                Private beta
              </h1>
              <p className="mb-8 text-lg text-white">
                Open to a limited number of users at the moment...
              </p>
              <a
                href="mailto:beta@podkastify.com"
                className="rounded bg-white px-4 py-2 font-bold text-purple-600 hover:bg-gray-200"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
      <section className="overflow-hidden pb-28 pt-12">
        <div className="container mx-auto px-4">
          <h2 className="font-heading tracking-px-n mb-5 text-center text-4xl font-bold leading-tight md:text-4xl">
            How it works
          </h2>
          <div className="-m-8 flex flex-wrap">
            <div className="w-full p-8 md:w-1/3">
              <div className="relative text-center">
                <img
                  className="absolute -right-40 top-8"
                  src="/line4.svg"
                  alt=""
                />
                <div className="font-heading relative mx-auto mb-10 h-14 w-14 rounded-full bg-white text-2xl font-bold">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <svg
                      width="25"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.5391 21L15.5391 15M17.5391 10C17.5391 13.866 14.4051 17 10.5391 17C6.67307 17 3.53906 13.866 3.53906 10C3.53906 6.13401 6.67307 3 10.5391 3C14.4051 3 17.5391 6.13401 17.5391 10Z"
                        stroke="#111827"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mx-auto md:max-w-xs">
                  <h3 className="font-heading font-heading mb-5 text-xl font-bold leading-normal">
                    Add a Youtube link to Podkastify
                  </h3>
                  <p className="font-sans">
                    It'll be added to your personal podcast feed.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full p-8 md:w-1/3">
              <div className="relative text-center">
                <img
                  className="absolute -right-40 top-8"
                  src="/line4.svg"
                  alt=""
                />
                <div className="font-heading relative mx-auto mb-10 h-14 w-14 rounded-full bg-indigo-600 text-2xl font-bold">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 14V20M14 17H20M6 10H8C9.10457 10 10 9.10457 10 8V6C10 4.89543 9.10457 4 8 4H6C4.89543 4 4 4.89543 4 6V8C4 9.10457 4.89543 10 6 10ZM16 10H18C19.1046 10 20 9.10457 20 8V6C20 4.89543 19.1046 4 18 4H16C14.8954 4 14 4.89543 14 6V8C14 9.10457 14.8954 10 16 10ZM6 20H8C9.10457 20 10 19.1046 10 18V16C10 14.8954 9.10457 14 8 14H6C4.89543 14 4 14.8954 4 16V18C4 19.1046 4.89543 20 6 20Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mx-auto md:max-w-xs">
                  <h3 className="font-heading font-heading mb-5 text-xl font-bold leading-normal">
                    Grab your personal podcast feed URL
                  </h3>
                  <p className="font-sans">
                    Podkastify will create a podcast feed URL just for you. Just
                    add it to your personal podcast app.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full p-8 md:w-1/3">
              <div className="text-center">
                <div className="font-heading relative mx-auto mb-10 h-14 w-14 rounded-full bg-white text-2xl font-bold">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                    <svg
                      width="25"
                      height="24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.4609 11C11.9087 11 11.4609 11.4477 11.4609 12C11.4609 12.5523 11.9087 13 12.4609 13V11ZM15.4609 13C16.0132 13 16.4609 12.5523 16.4609 12C16.4609 11.4477 16.0132 11 15.4609 11V13ZM12.4609 15C11.9087 15 11.4609 15.4477 11.4609 16C11.4609 16.5523 11.9087 17 12.4609 17V15ZM15.4609 17C16.0132 17 16.4609 16.5523 16.4609 16C16.4609 15.4477 16.0132 15 15.4609 15V17ZM9.46094 11C8.90865 11 8.46094 11.4477 8.46094 12C8.46094 12.5523 8.90865 13 9.46094 13V11ZM9.47094 13C10.0232 13 10.4709 12.5523 10.4709 12C10.4709 11.4477 10.0232 11 9.47094 11V13ZM9.46094 15C8.90865 15 8.46094 15.4477 8.46094 16C8.46094 16.5523 8.90865 17 9.46094 17V15ZM9.47094 17C10.0232 17 10.4709 16.5523 10.4709 16C10.4709 15.4477 10.0232 15 9.47094 15V17ZM18.4609 7V19H20.4609V7H18.4609ZM17.4609 20H7.46094V22H17.4609V20ZM6.46094 19V7H4.46094V19H6.46094ZM7.46094 6H9.46094V4H7.46094V6ZM15.4609 6H17.4609V4H15.4609V6ZM7.46094 20C6.90865 20 6.46094 19.5523 6.46094 19H4.46094C4.46094 20.6569 5.80408 22 7.46094 22V20ZM18.4609 19C18.4609 19.5523 18.0132 20 17.4609 20V22C19.1178 22 20.4609 20.6569 20.4609 19H18.4609ZM20.4609 7C20.4609 5.34315 19.1178 4 17.4609 4V6C18.0132 6 18.4609 6.44772 18.4609 7H20.4609ZM6.46094 7C6.46094 6.44772 6.90865 6 7.46094 6V4C5.80408 4 4.46094 5.34315 4.46094 7H6.46094ZM12.4609 13H15.4609V11H12.4609V13ZM12.4609 17H15.4609V15H12.4609V17ZM11.4609 4H13.4609V2H11.4609V4ZM13.4609 6H11.4609V8H13.4609V6ZM11.4609 6C10.9087 6 10.4609 5.55228 10.4609 5H8.46094C8.46094 6.65685 9.80408 8 11.4609 8V6ZM14.4609 5C14.4609 5.55228 14.0132 6 13.4609 6V8C15.1178 8 16.4609 6.65685 16.4609 5H14.4609ZM13.4609 4C14.0132 4 14.4609 4.44772 14.4609 5H16.4609C16.4609 3.34315 15.1178 2 13.4609 2V4ZM11.4609 2C9.80408 2 8.46094 3.34315 8.46094 5H10.4609C10.4609 4.44772 10.9087 4 11.4609 4V2ZM9.46094 13H9.47094V11H9.46094V13ZM9.46094 17H9.47094V15H9.46094V17Z"
                        fill="#111827"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="mx-auto md:max-w-xs">
                  <h3 className="font-heading font-heading mb-5 text-xl font-bold leading-normal">
                    Keep adding new videos!
                  </h3>
                  <p className="font-sans">
                    Each new video you add to Podkastify will automatically
                    appear in your podcast app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
