import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/AudioPlayer.module.css";
import { BsArrowLeftShort } from "react-icons/bs";
import { BsArrowRightShort } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";

const highLights = [
  { startPosition: 30, endPosition: 45 },
  { startPosition: 40, endPosition: 70 },
  { startPosition: 20, endPosition: 40 },
];

const AudioPlayer = () => {
  // state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [highLightBlocks, setHighLightBlocks] = useState([]);
  const [index, setindex] = useState(0);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation

  useEffect(() => {
    const seconds = Math.floor(audioPlayer.current.duration);
    setDuration(seconds);
    progressBar.current.max = seconds;
  }, [audioPlayer?.current?.loadedmetadata, audioPlayer?.current?.readyState]);

  useEffect(() => {
    // const hBlocks = [
    //   { startPosition: 30, endPosition: 45 },
    //   { startPosition: 40, endPosition: 70 },
    //   { startPosition: 20, endPosition: 40 },
    // ].map((h) => getBlockPositions(h));
    // setHighLightBlocks(hBlocks);
  }, []);

  const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    progressBar.current.value = audioPlayer.current.currentTime;
    changePlayerCurrentTime();
    animationRef.current = requestAnimationFrame(whilePlaying);
  };

  const changeRange = () => {
    audioPlayer.current.currentTime = progressBar.current.value;
    changePlayerCurrentTime();
  };

  const changePlayerCurrentTime = () => {
    progressBar.current.style.setProperty(
      "--seek-before-width",
      `${(progressBar.current.value / duration) * 100}%`
    );
    setCurrentTime(progressBar.current.value);
  };

  const backThirty = () => {
    progressBar.current.value = Number(progressBar.current.value - 30);
    changeRange();
  };

  const forwardThirty = () => {
    progressBar.current.value = Number(progressBar.current.value + 30);
    changeRange();
  };

  const getBlockPositions = (highLightItemData) => {
    const find = highLightBlocks.filter((data) => {
      if (data.id !== highLightItemData[0].id) {
        return {
          ...data,
        };
      }
    });
    if (find.length === highLightBlocks.length) {
      let listdata = highLightItemData?.map((highLightItem) => {
        let leftSpace = Math.trunc(
          (highLightItem?.startPosition * 350) / duration
        );
        let endPosition = Math.trunc(
          (highLightItem?.endPosition * 350) / duration
        );
        let blockWidth = endPosition - leftSpace;
        console.log("leftSpace", leftSpace);
        return {
          leftSpace: leftSpace,
          blockWidth: blockWidth,
          timeStampColor: highLightItem.timeStampColor,
          id: highLightItem.id,
          index: index + 1,
        };
      });
      setHighLightBlocks([...listdata, ...highLightBlocks]);
      setindex(index + 1);
      console.log("listdata", listdata);
    } else {
      // console.log("find all data", find);
      let changeIndex = find.map((data) => {
        return {
          ...data,
          index: data.index - 1,
        };
      });

      console.log("changeIndex ", changeIndex);
      if (index > 1) {
        setindex(index - 1);
      } else {
        setindex(0);
      }
      setHighLightBlocks(changeIndex);
    }
  };

  useEffect(() => {}, [highLightBlocks]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div className={styles.audioPlayer}>
        <audio
          ref={audioPlayer}
          src="https://cdn.simplecast.com/audio/cae8b0eb-d9a9-480d-a652-0defcbe047f4/episodes/af52a99b-88c0-4638-b120-d46e142d06d3/audio/500344fb-2e2b-48af-be86-af6ac341a6da/default_tc.mp3"
          preload="metadata"
        ></audio>
        <button className={styles.forwardBackward} onClick={backThirty}>
          <BsArrowLeftShort /> 30
        </button>
        <button onClick={togglePlayPause} className={styles.playPause}>
          {isPlaying ? <FaPause /> : <FaPlay className={styles.play} />}
        </button>
        <button className={styles.forwardBackward} onClick={forwardThirty}>
          30 <BsArrowRightShort />
        </button>

        {/* current time */}
        <div className={styles.currentTime}>{calculateTime(currentTime)}</div>

        {/* progress bar */}
        <div className="progress-4 relative">
          {highLightBlocks.length > 0 &&
            highLightBlocks.map((highLightBlock) => {
              if (highLightBlock.leftSpace || highLightBlock.blockWidth) {
                let blockStyle = `w-[${highLightBlock.blockWidth}px] left-[${highLightBlock.leftSpace}px] `;
                return (
                  <div
                    // width={highLightBlock.blockWidth + "px"}

                    className={`progress ${blockStyle}`}
                  ></div>
                );
              }
              return null;
            })}
          <div className={styles.mainRange}>
            <input
              type="range"
              className={styles.progressBar}
              defaultValue="0"
              ref={progressBar}
              onChange={changeRange}
            />
            <div className={styles.seekBar}>
              {highLightBlocks?.map((data) => (
                <div
                  className={styles.seekBar1}
                  style={{
                    width: `${data.blockWidth}px`,
                    height: "60%",
                    left: `${data.leftSpace}px`,
                    backgroundColor: `${data.timeStampColor}`,
                    position: "absolute",
                    opacity: 0.7,
                    zIndex: data.index,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* duration */}
        <div className={styles.duration}>
          {duration && !isNaN(duration) && calculateTime(duration)}
        </div>
      </div>
      <div className={styles.buttonlist}>
        <button
          style={{
            backgroundColor: "#FF0000",
          }}
          className={styles.buttonStyle}
          onClick={() => {
            getBlockPositions([
              {
                startPosition: 3,
                endPosition: 35,
                timeStampColor: "#FF0000",
                id: 1,
              },
              {
                startPosition: 50,
                endPosition: 70,
                timeStampColor: "#FF0000",
                id: 1,
              },
            ]);
          }}
        >
          Exercises
        </button>
        <button
          style={{
            backgroundColor: "#309c00",
          }}
          className={styles.buttonStyle}
          onClick={() =>
            getBlockPositions([
              {
                startPosition: 25,
                endPosition: 40,
                timeStampColor: "#309c00",
                id: 2,
              },

              {
                startPosition: 50,
                endPosition: 55,
                timeStampColor: "#309c00",
                id: 2,
              },
            ])
          }
        >
          Questions
        </button>
        <button
          className={styles.buttonStyle}
          style={{
            backgroundColor: "#fff40f",
          }}
          onClick={() =>
            getBlockPositions([
              {
                startPosition: 70,
                endPosition: 75,
                timeStampColor: "#fff40f",
                id: 3,
              },
            ])
          }
        >
          Need Review
        </button>
      </div>
    </div>
  );
};

export { AudioPlayer };
