import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import countries from "world-countries";
import { FaArrowLeft } from "react-icons/fa";

const Result = () => {
  const [data, setData] = useState([]);
  const svgRef = useRef();
  const navigate = useNavigate();

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const ageOptions = Array.from({ length: 20 }, (_, i) => {
    const start = i * 10 + 1;
    const end = start + 9;
    return {
      value: `${start}-${end}`,
      label: `${start}-${end}`,
    };
  });

  const handleGenderChange = (selectedOption) => {
    setGender(selectedOption.value);
    fetchData(country, selectedOption.value, age);
  };

  const handleAgeChange = (selectedOption) => {
    setAge(selectedOption.value);
    fetchData(country, gender, selectedOption.value);
  };

  const countryOptions = countries.map((country) => ({
    value: country.name.common,
    label: country.name.common,
  }));

  const handleCountryChange = (selectedOption) => {
    setCountry(selectedOption.value);
    fetchData(selectedOption.value, gender, age);
  };

  const formData = {
    country: country,
    gender: gender,
    age: age,
  };

  // APIからデータを取得する関数
  const fetchData = (country, gender, age) => {
    let baseURL = "http://ec2-98-83-117-130.compute-1.amazonaws.com/api/cutiees";

    // Array to hold query parameters
    let queryParams = [];

    // Add country to query parameters if it's not empty
    if (country !== "") {
      queryParams.push(`country=${encodeURIComponent(country)}`);
    }

    // Add gender to query parameters if it's not empty
    if (gender !== "") {
      queryParams.push(`gender=${encodeURIComponent(gender)}`);
    }

    // Add age to query parameters if it's not empty
    if (age !== "") {
      queryParams.push(`age=${encodeURIComponent(age)}`);
    }

    // If there are any query parameters, append them to the base URL
    if (queryParams.length > 0) {
      baseURL += "?" + queryParams.join("&");
    }

    axios
      .get(baseURL)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("データの取得中にエラーが発生しました:", error);
      });

    // try {
    //   const response =  axios.get(baseURL)
    //   setData(response.data);
    // } catch (error) {
    //   console.error("データの取得中にエラーが発生しました:", error);
    // }
  };

  // バブルチャートを描画する関数
  const drawBubbleChart = () => {
    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.selectAll("*").remove(); // 以前の描画をクリア

    // バブルの位置を計算するためのシミュレーション
    const simulation = d3
      .forceSimulation(data)
      .force("charge", d3.forceManyBody().strength(5))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide().radius((d) => d.radius || 30)
      );

    // データポイントごとにノードを作成
    const nodes = svg
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`); // 初期位置を中央に設定

    // バブル（円）を追加
    nodes
      .append("circle")
      .attr("r", (d) => d.radius || 30)
      .attr("fill", "steelblue")
      .attr("stroke", "white")
      .attr("stroke-width", 1.5);

    // テキストをバブル内に追加
    nodes
      .append("text")
      .text((d) => d.text)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white")
      .style("pointer-events", "none")
      .style("font-size", "12px");

    // 画像がある場合、バブル内に画像を表示
    nodes
      .append("clipPath")
      .attr("id", (d, i) => `clip-circle-${i}`)
      .append("circle")
      .attr("r", (d) => d.radius || 30);

    nodes
      .append("image")
      .attr("xlink:href", (d) => d.image)
      .attr("width", (d) => (d.radius || 30) * 2)
      .attr("height", (d) => (d.radius || 30) * 2)
      .attr("x", (d) => -(d.radius || 30))
      .attr("y", (d) => -(d.radius || 30))
      .attr("clip-path", (d, i) => `url(#clip-circle-${i})`);

    // シミュレーションの各ティックで位置を更新
    simulation.nodes(data).on("tick", () => {
      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
  };

  useEffect(() => {
    fetchData("", "", "");
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      drawBubbleChart();
    }
  }, [data]);

  const handleBackClick = () => {
    navigate("/");
  };

  return (

    <>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        position: "relative",
      }}
    >
      <button
        onClick={handleBackClick}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "100px",
          display: "flex",
          flexDirection: "row",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        <FaArrowLeft style={{ marginRight: "10px" }} />
        {`Back`}
      </button>
      <h2
        style={{
          fontWeight: "700",
          marginBottom: "-50px",
          textAlign: "center",
        }}
      >
        {`みんなのかわいい Everyone's Cuteness`}
      </h2>

{/* Filters */}
      <div
      
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        padding: "20px",
        gap: "20px",
      }}
      >
        {/* Age dropdown */}
        <div style={{ marginBottom: "10px" }}>
          <Select
            name="age"
            placeholder="Select your age range"
            options={ageOptions}
            onChange={handleAgeChange}
            value={ageOptions.find((option) => option.value === formData.age)}
            styles={{
              control: (provided) => ({
                ...provided,
                width: 317,
                border: "2px solid #9c9c9c",
                borderRadius: "5px",
                outline: "none",
              }),
            }}
          />
        </div>

        {/* Gender dropdown */}
        <div style={{ marginBottom: "10px" }}>
          <Select
            name="gender"
            placeholder="Select your gender"
            options={genderOptions}
            onChange={handleGenderChange}
            value={genderOptions.find(
              (option) => option.value === formData.gender
            )}
            styles={{
              control: (provided) => ({
                ...provided,
                width: 317,
                border: "2px solid #9c9c9c",
                borderRadius: "5px",
                outline: "none",
              }),
            }}
          />
        </div>

        {/* Country dropdown */}
        <div style={{ marginBottom: "10px" }}>
          <Select
            name="country"
            placeholder="Select your country"
            options={countryOptions}
            onChange={handleCountryChange}
            value={countryOptions.find(
              (option) => option.value === formData.country
            )}
            styles={{
              control: (provided) => ({
                ...provided,
                width: 317,
                border: "2px solid #9c9c9c",
                borderRadius: "5px",
                outline: "none",
              }),
            }}
          />
        </div>
      </div>

      <svg ref={svgRef} width={800} height={600} />
    </div>
  );
};

export default Result;
