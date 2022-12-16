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
  const [startTime, setStartTime] = useState({
    hour: null,
    min: null,
    sec: null,
  });
  const [endTime, setEndTime] = useState({
    hour: null,
    min: null,
    sec: null,
  });
  const [blockList, setBlocakList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [highLightBlocks, setHighLightBlocks] = useState([]);
  const [index, setindex] = useState(0);

  // references
  const audioPlayer = useRef(); // reference our audio component
  const progressBar = useRef(); // reference our progress bar
  const animationRef = useRef(); // reference the animation
  const [message, setMessage] = useState("");
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
    console.log("all sec", secs);
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

  const changeStartdate = (e) => {
    setStartTime({ ...startTime, [e.target.name]: e.target.value });
  };

  const changeEndTime = (e) => {
    setEndTime({ ...endTime, [e.target.name]: e.target.value });
  };

  const countNumber = (number) => {
    let hour = number?.hour * 3600 || 0;
    let min = number?.min * 60 || 0;
    let sec = Number(number?.sec) + Number(min) + Number(hour);
    return sec;
  };

  const getBlockPositions = (highLightItemData) => {
    const find = highLightBlocks.filter((data) => {
      if (data.id !== highLightItemData.id) {
        return {
          ...data,
        };
      }
    });
    if (find.length === highLightBlocks.length) {
      console.log("find ");

      const getSelectdData = blockList.filter((data) => {
        return data.id === highLightItemData.id;
      });

      console.log("get all data", getSelectdData);

      let listdata = getSelectdData?.map((highLightItem) => {
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

  const addExercises = (details) => {
    let startime = countNumber(startTime);
    let endtime = countNumber(endTime);
    console.log("enter condition", startime, endtime);
    if (startime < endtime && duration > startime && duration > endtime) {
      setBlocakList([
        ...blockList,
        {
          startPosition: startime,
          endPosition: endtime,
          timeStampColor: details.color,
          id: details.id,
          action: details.action,
        },
      ]);

      setStartTime({
        hour: 0,
        min: 0,
        sec: 0,
      });

      setEndTime({
        hour: 0,
        min: 0,
        sec: 0,
      });
      setMessage("");
      alert(details.message + "Time is added");
    } else {
      setMessage("Please Enter Valid Time");
    }

    console.log("startime", startime, endtime);
  };

  useEffect(() => {}, [highLightBlocks]);
  const getNewData = (e) => {
    console.log("asnckn", e);
  };
  return (
    <>
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
            <div className={styles.mainRange} onClick={getNewData}>
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
              getBlockPositions({ id: 1 });
            }}
          >
            Exercises
          </button>
          <button
            style={{
              backgroundColor: "#309c00",
            }}
            className={styles.buttonStyle}
            onClick={() => getBlockPositions({ id: 2 })}
          >
            Questions
          </button>
          <button
            className={styles.buttonStyle}
            style={{
              backgroundColor: "#fff40f",
            }}
            onClick={() => getBlockPositions({ id: 3 })}
          >
            Need Review
          </button>
        </div>
      </div>

      <div
        className="custom"
        style={{
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            color: "red",
            top: "50px",
          }}
        >
          {message}
        </div>
        <div
          className=""
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <div className="startpositon">
              <div> Start Time</div>
              <div className="alllabel">
                <div>
                  <input
                    type="number"
                    name="hour"
                    min={0}
                    max={23}
                    placeholder="HH"
                    value={startTime.hour}
                    onChange={changeStartdate}
                  />
                </div>

                <div>
                  <input
                    type="number"
                    name="min"
                    min={0}
                    max={59}
                    value={startTime.min}
                    placeholder="MM"
                    onChange={changeStartdate}
                  />
                </div>

                <div>
                  <input
                    type="number"
                    name="sec"
                    min={0}
                    // max={60}
                    value={startTime.sec}
                    placeholder="SS"
                    max={59}
                    onChange={changeStartdate}
                  />
                </div>
              </div>
            </div>
            <div className="startpositon">
              <div> End Time</div>

              <div className="alllabel">
                <div>
                  <input
                    type="number"
                    name="hour"
                    min={0}
                    max={24}
                    placeholder="HH"
                    value={endTime.hour}
                    onChange={changeEndTime}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="min"
                    min={0}
                    max={59}
                    value={endTime.min}
                    placeholder="MM"
                    onChange={changeEndTime}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="sec"
                    min={0}
                    max={59}
                    value={endTime.sec}
                    placeholder="SS"
                    onChange={changeEndTime}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
            }}
          >
            <button
              style={{
                backgroundColor: "#FF0000",
              }}
              className={styles.buttonStyle}
              onClick={() =>
                addExercises({
                  id: 1,
                  color: "#FF0000",
                  message: "Exercises Time",
                  action: "Exercises ",
                })
              }
            >
              Add Exercises Time
            </button>
            <button
              style={{
                backgroundColor: "#309c00",
              }}
              className={styles.buttonStyle}
              onClick={() =>
                addExercises({
                  id: 2,
                  color: "#309c00",
                  message: "Questions Time",
                  action: "Questions ",
                })
              }
            >
              Add Questions Time
            </button>
            <button
              style={{
                backgroundColor: "#fff40f",
              }}
              className={styles.buttonStyle}
              onClick={() =>
                addExercises({
                  id: 3,
                  color: "#fff40f",
                  message: "Review Time",
                  action: "Need Review ",
                })
              }
            >
              Add Need Review Time
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 100,
        }}
      >
        <table>
          <tr>
            <th>index</th>
            <th>Startime</th>
            <th>EndTime</th>
            <th>Action</th>
          </tr>

          {blockList.map((data, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{calculateTime(data.startPosition)}</td>{" "}
              <td>{calculateTime(data.endPosition)}</td>
              <td
                style={{
                  backgroundColor: data.timeStampColor,
                }}
              >
                {data.action}
              </td>
            </tr>
          ))}
        </table>
      </div>

      <div>
        <input
          type="range"
          className={styles.progressBar}
          ref={progressBar}
          onChange={changeRange}
        />
      </div>
    </>
  );
};

export { AudioPlayer };
