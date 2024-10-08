import React, { useState } from "react";
import useTitle from "../hooks/useTitle";
import Me from "../assets/home/Me.png";
import "../App.css";

const About = () => {
  useTitle("About");

  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-200 mb-12 text-center">
          About Me
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative flex justify-center bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-3 rounded-lg shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out hover:scale-105">
              {isLoaded && (
                <div
                  className={`flex justify-center align-middle items-center w-auto px-36 h-full text-white rounded-lg shadow-md object-cover transform hover:scale-105 transition duration-500 ${
                    !isLoaded ? "block" : "hidden"
                  }`}
                >
                  Loading...
                </div>
              )}

              <img
                src={Me}
                alt="Marcus David Alo"
                className={`rounded-lg shadow-md object-cover transform hover:scale-105 transition duration-500 ${
                  isLoaded ? "block" : "hidden"
                }`}
                onLoad={handleImageLoad}
              />
              <p className="absolute w-[95%] bottom-2 mx-2 bg-zinc-800/90 text-white text-sm px-3 py-1 rounded-lg">
                This image was generated with my actual face run through Stable
                Diffusion Controlnet.
              </p>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-200 mb-6">
              Marcus David Alo
            </h2>
            <div className="text-xl space-y-6 leading-relaxed text-zinc-700 dark:text-zinc-400">
              <p>
                I am an enthusiastic beginner web developer with a solid grasp
                of JavaScript, React, and modern web technologies. I'm
                passionate about continuously expanding my skills in web
                development. Currently, I'm self-studying AI and Python, and
                I've even cloned some language models like Ollama and TavernAI.
                I've also enjoyed cloning and using web interfaces for projects
                like "InvokeAI" and "Automatic1111", and I'm now exploring
                "OpenDevin" and "Devika" which is to my knowledge an open source
                version of Devin.ai.
              </p>
              <p>
                I'm always eager to learn new emerging technologies relating to
                web development and AI. Discovering fresh technology excites me
                for the future. I experimented with Expo after encountering
                React Native as it was the easiest way to get started on it.
                These endeavors continuously grow my abilities and understanding
                in different tech areas.
              </p>
              <p>
                On Kodego, I took their web development bootcamp course as I
                have always been interested in web development, but before that,
                I studied Computer Science at AMA Computer College Cebu. While
                at AMA, I left during my third year. The reason was that I felt
                like I wasn't truly learning about Computer Science and was
                simply learning what seemed more fit for IT students. Despite
                that, it was still a meaningful experience. It inspired me to
                try pursuing a more practical, self-directed educational path.
              </p>
              <p>
                When I'm not coding or studying new tech, I dig into other
                interests. Reading up on the latest technology trends keeps me
                informed. Exploring nature rejuvenates me. And engaging with
                artificial intelligence brings me joy. These varied pursuits
                balance my driven approach to coding.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
