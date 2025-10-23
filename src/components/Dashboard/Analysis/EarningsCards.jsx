import React from "react";
import Card from "../Card/Card";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const EarningsCards = ({ summary }) => {
  const todayIcon = <AttachMoneyIcon style={{ color: "white", fontSize: 30 }} />;
  const monthIcon = <CalendarMonthIcon style={{ color: "white", fontSize: 30 }} />;
  const totalIcon = <TrendingUpIcon style={{ color: "white", fontSize: 30 }} />;

  const earnings = [
    {
      title: "Today's Earnings",
      icon: todayIcon,
      value: summary.todayEarning,
      barValue: summary.todayEarning > 0 ? 100 : 0,
      color: {
        backGround: "linear-gradient(180deg, #f093fb 0%, #f5576c 100%)",
        boxShadow: "0px 10px 20px 0px #f8c7d8",
      },
    },
    {
      title: "This Month's Earnings",
      icon: monthIcon,
      value: summary.monthEarning.toFixed(2),
      barValue: Math.min(100, ((summary.monthEarning / 20000) * 100).toFixed(2)), // assume 20K target
      color: {
        backGround: "linear-gradient(180deg, #36D1DC 0%, #5B86E5 100%)",
        boxShadow: "0px 10px 20px 0px #c1e0ff",
      },
    },
    {
      title: "Total Earnings",
      icon: totalIcon,
      value: summary.totalEarning,
      barValue: 100,
      color: {
        backGround: "linear-gradient(180deg, #ffb347 0%, #ffcc33 100%)",
        boxShadow: "0px 10px 20px 0px #ffe8b0",
      },
    },
  ];

  return (
    <div className="Cards">
      {earnings.map((card, index) => (
        <div className="parentContainer" key={index}>
          <Card
            title={card.title}
            icon={card.icon}
            value={card.value}
            unit="₹"
            barValue={card.barValue}
            color={card.color}
            disableExpand={true}
          />
        </div>
      ))}
    </div>
  );
};

export default EarningsCards;
