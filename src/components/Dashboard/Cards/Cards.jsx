import React, { useEffect, useState } from "react";
import "./Cards.css";
import Card from "../Card/Card";
import memberService from "../../../service/memberService"; // adjust path as needed
import GroupIcon from '@mui/icons-material/Group';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonOffIcon from '@mui/icons-material/PersonOff';

const Cards = () => {
  const groupIcon = <GroupIcon style={{ color: "white", fontSize: 30 }} />;
  const activeIcon = <HowToRegIcon style={{ color: "white", fontSize: 30 }} />;
  const expiredIcon = <PersonOffIcon style={{ color: "white", fontSize: 30 }} />;
  
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await memberService.analysisMembers();
        const data = response.data.data;

        setCards([
  {
    title: "Total Members",
    icon: groupIcon,
    color: {
      backGround: "linear-gradient(355deg, #0c72f7ff 0%, #ffb347 100%)", // Slightly richer blue
      boxShadow: "0px 10px 30px 0px #ffe8b0",
    },
    barValue: 100,
    value: data.totalMembers,
  },
  {
    title: "Active Members",
    icon: activeIcon,
    color: {
      backGround: "linear-gradient(135deg, #ffb347 0%, #0bd73bff 100%)", // Soft but richer green
      boxShadow: "0px 10px 30px 0px #ffe8b0",
    },
    barValue: Math.round((data.activeMembers / data.totalMembers) * 100),
    value: data.activeMembers,
  },
  {
    title: "Expired Members",
    icon: expiredIcon,
    color: {
      backGround: "linear-gradient(135deg, #ffcc33 0%, #ff1827ff 100%)", // Visible pastel red
      boxShadow: "0px 10px 30px 0px #ffe8b0",
    },
    barValue: Math.round((data.suspendedMembers / data.totalMembers) * 100),
    value: data.suspendedMembers,
  },
]);

      } catch (error) {
        console.error("Error fetching analysis data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="Cards">
      {cards.map((card, id) => (
        <div className="parentContainer" key={id}>
          <Card
            title={card.title}
            icon={card.icon}
            color={card.color}
            barValue={card.barValue}
            value={card.value}
            disableExpand={true}
          />
        </div>
      ))}
    </div>
  );
};

export default Cards;
