import React, { useEffect, useState, useMemo } from "react";
import memberService from "../../../service/memberService";
import { useNavigate } from "react-router-dom";
import { Card } from "../../ui/card";
import { useTheme } from "../../../context/ThemeContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { TextField, MenuItem } from "@mui/material";
import {
  getEarningsSummary
} from "../../../Utils/utils";
import EarningsCards from "./EarningsCards";
import { checkAndRefreshTokenIfOld } from "../../../Utils/authUtils";
import "./Analysis.css";
import { Box } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';

const GRADIENTS_GENDER = [
  { id: "gender2", from: "#31766fff", to: "#91e2daff" }, // Teal to light teal
  { id: "gender0", from: "#BA68C8", to: "#FFD6FA" }, // Purple to light lilac
  { id: "gender1", from: "#f9a82fff", to: "#FFE0B2" }  // Orange to pale orange
];
const GRADIENTS_MEMBER_TYPE = [
  { id: "color0", from: "#f6cfc9ff", to: "#d6630bee" }, // orange-red to orange
  { id: "color1", from: "#bfedfbff", to: "#0857f7ff" }, // blue gradient
];

const allMonths = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" }
];

export default function AnalyticsPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const axisColor = isDarkMode ? "#e0e0e0" : "#222";
  const labelColor = isDarkMode ? "#fff" : "#222";
  const legendColor = isDarkMode ? "#ddd" : "#333";
  const tooltipBg = isDarkMode ? "#23262b" : "#fff";
  const tooltipText = isDarkMode ? "#eee" : "#333";
  const textFieldBg = isDarkMode ? "#222" : "#fff";
  const textFieldColor = isDarkMode ? "#eee" : "#222";
  const textFieldBorder = isDarkMode ? "#444" : "#ccc";
  const menuBg = isDarkMode ? "#25262b" : "#fff";
  const menuText = isDarkMode ? "#eee" : "#222";
  const menuHover = isDarkMode ? "#333" : "#f5f5f5";
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const [selectedPieMonth, setSelectedPieMonth] = useState(now.getMonth()); // Pie Chart filter (NEW)
const isMobile = useMediaQuery('(max-width:600px)');
const barSize = isMobile ? 12 : 30;

  function MonthBarTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      // Find both segments if present
      const newJoinEntry = payload.find(p => p.dataKey === 'newJoin');
      const renewalEntry = payload.find(p => p.dataKey === 'renewal');
      return (
        <div style={{
          background: "#fff",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          color: "#222",
          minWidth: "160px"
        }}>
          <div><strong>Month:</strong> {label} {selectedYear}</div>
          <div style={{ color: "#00C853", marginTop: 4 }}>
            <strong>New Join:</strong> {newJoinEntry?.value ?? 0}
          </div>
          <div style={{ color: "#2196F3" }}>
            <strong>Renewal:</strong> {renewalEntry?.value ?? 0}
          </div>
        </div>
      );
    }
    return null;
  }

  function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      const newJoinEntry = payload.find(p => p.dataKey === 'newJoin');
      const renewalEntry = payload.find(p => p.dataKey === 'renewal');

      const newJoinValue = newJoinEntry?.value ?? 0;
      const renewalValue = renewalEntry?.value ?? 0;

      return (
        <div style={{
          background: "#fff",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
          color: "#222",
          minWidth: "160px"
        }}>
          <div>{label} {allMonths[selectedMonth].label}</div>
          <div style={{ color: "#4CAF50", marginTop: 4 }}>
            <strong>New Join:</strong> {newJoinValue}
          </div>
          <div style={{ color: "#2196F3" }}>
            <strong>Renewal:</strong> {renewalValue}
          </div>
        </div>
      );
    }
    return null;
  }

  const fetchMembers = async () => {
    try {
      const response = await memberService.getMembers();
      if (response.data.success) {
        setMembers(response.data.data);
      }
      await checkAndRefreshTokenIfOld();
    } catch (error) {
      if (error.response?.status === 403) {
        setTimeout(() => {
          localStorage.clear();
        }, 5000);
        navigate("/");
        window.location.href = "/";
      }
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Compute all available membership years from members, or default to current and previous years
  const allYearsArr = useMemo(() => {
    // If your member objects have a joiningDate/membershipRenewDate
    const years = new Set();
    members.forEach(m => {
      const dt = m.membershipRenewDate
        ? new Date(m.membershipRenewDate)
        : new Date(m.joiningDate);
      years.add(dt.getFullYear());
    });
    // If no data yet, fallback to [currentYear]
    if (years.size === 0) years.add(now.getFullYear());
    // Sort descending for UX
    return Array.from(years).sort((a, b) => b - a);
  }, [members]);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const summary = useMemo(() => getEarningsSummary(members), [members]);

  const currentYear = now.getFullYear();

  const getMemberActiveDate = (member) => {
    // Adjust to use correct field name; check for nulls
    return member.membershipRenewDate ? new Date(member.membershipRenewDate) : new Date(member.joiningDate);
  };

  const daywiseData = useMemo(() => {
    const newJoinsMap = {};
    const renewalsMap = {};
    const filteredMembers = members.filter(member => {
      const activeDate = getMemberActiveDate(member);
      return (
        activeDate.getFullYear() === currentYear &&
        activeDate.getMonth() === selectedMonth
      );
    });
    filteredMembers.forEach(member => {
      const activeDate = getMemberActiveDate(member);
      const day = activeDate.getDate();
      const joinDate = new Date(member.joiningDate);

      if (
        member.membershipRenewDate &&
        new Date(member.membershipRenewDate).getTime() > joinDate.getTime() &&
        activeDate.getTime() === new Date(member.membershipRenewDate).getTime()
      ) {
        renewalsMap[day] = (renewalsMap[day] || 0) + 1;
      } else {
        newJoinsMap[day] = (newJoinsMap[day] || 0) + 1;
      }
    });

    const lastDay =
      selectedMonth === now.getMonth() && currentYear === now.getFullYear()
        ? now.getDate()
        : new Date(currentYear, selectedMonth + 1, 0).getDate();

    return Array.from({ length: lastDay }, (_, i) => {
      const day = i + 1;
      const newJoin = newJoinsMap[day] || 0;
      const renewal = renewalsMap[day] || 0;
      return {
        day,
        joined: newJoin + renewal,  // total sum for area chart
        newJoin,
        renewal
      };
    });
  }, [members, selectedMonth, currentYear]);

  const monthlyData = useMemo(() => {
    // Create maps for each month: newJoin and renewal
    const newJoinsMap = {};
    const renewalsMap = {};

    members.forEach(member => {
      const activeDate = member.membershipRenewDate
        ? new Date(member.membershipRenewDate)
        : new Date(member.joiningDate);
      const joinDate = new Date(member.joiningDate);

      if (activeDate.getFullYear() === selectedYear) {
        const month = activeDate.getMonth();
        if (
          member.membershipRenewDate &&
          new Date(member.membershipRenewDate).getTime() > joinDate.getTime() &&
          activeDate.getTime() === new Date(member.membershipRenewDate).getTime()
        ) {
          renewalsMap[month] = (renewalsMap[month] || 0) + 1;
        } else {
          newJoinsMap[month] = (newJoinsMap[month] || 0) + 1;
        }
      }
    });

    // Prepare chart data for each month (up to current month if current year)
    const currentMonthIndex = selectedYear === now.getFullYear() ? now.getMonth() : 11;
    return Array.from({ length: currentMonthIndex + 1 }, (_, idx) => {
      const newJoin = newJoinsMap[idx] || 0;
      const renewal = renewalsMap[idx] || 0;
      return {
        month: allMonths[idx].label,
        newJoin,
        renewal,
        joined: newJoin + renewal,
      };
    });
  }, [members, selectedYear, now]);


  const genderData = useMemo(() => {
    let male = 0, female = 0, other = 0;
    members.forEach(member => {
      const gender = member.gender?.toLowerCase() || "male";
      if (gender === "female") female++;
      else if (gender === "other") other++;
      else male++;
    });
    return [
      { name: "Male", value: male },
      { name: "Female", value: female },
      { name: "Other", value: other },
    ];
  }, [members]);

  const newVsReturning = useMemo(() => {
    let newCount = 0;
    let renewCount = 0;
    members.forEach(member => {
      const joinDate = new Date(member.joiningDate);
      const activeDate = getMemberActiveDate(member);

      if (
        activeDate.getFullYear() === currentYear &&
        activeDate.getMonth() === selectedPieMonth // <-- USE PIE FILTER
      ) {
        if (
          member.membershipRenewDate &&
          new Date(member.membershipRenewDate).getTime() > joinDate.getTime() &&
          activeDate.getTime() === new Date(member.membershipRenewDate).getTime()
        ) {
          renewCount++;
        } else {
          newCount++;
        }
      }
    });
    return [
      { name: "New", value: newCount },
      { name: "Renewed", value: renewCount },
    ];
  }, [members, selectedPieMonth, currentYear]);
  const hasPieData = newVsReturning.some(item => item.value > 0);
  return (
    <div className="p-4">
      <h1 className="analytics-heading">Analytics</h1>

      <Box mt={2} mb={2.7}>
        <EarningsCards summary={summary} />
      </Box>

      <div className="analytics-graph-grid">
        <Card className="p-4" style={{ position: "relative" }}>
          <h2 className="text-lg font-bold mb-2">
            Members Join & ReNew in {allMonths[selectedMonth].label}
          </h2>
          {/* ---- Month Picker at top right, wrapped in Box for alignment ---- */}
          <Box className="card-month-picker-box" sx={{ position: "absolute", right: 16, top: 16, zIndex: 1 }}>
            <TextField
              select
              label="Month"
              size="small"
              value={selectedMonth}
              onChange={e => setSelectedMonth(Number(e.target.value))}
              sx={{
                minWidth: 110,
                background: textFieldBg,
                borderRadius: 2,
                color: textFieldColor,
                "& .MuiInputBase-root": {
                  color: textFieldColor,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: textFieldBorder,
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "#888" : "#999",
                },
                "& .MuiInputLabel-root": {
                  color: labelColor,
                },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: menuBg,
                      color: menuText,
                      "& .MuiMenuItem-root": {
                        "&:hover": {
                          backgroundColor: menuHover,
                          color: menuText
                        }
                      }
                    }
                  }
                },
                style: { fontSize: 14 }
              }}
              InputLabelProps={{
                style: { color: labelColor }
              }}
            >
              {allMonths
                .filter(m => m.value <= now.getMonth() || currentYear !== now.getFullYear())
                .map(month => (
                  <MenuItem
                    key={month.value}
                    value={month.value}
                    sx={{
                      background: menuBg,
                      color: menuText,
                      "&:hover": {
                        backgroundColor: menuHover,
                        color: menuText
                      }
                    }}
                  >
                    {month.label}
                  </MenuItem>
                ))}
            </TextField>
          </Box>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={daywiseData}>
              <defs>
                <linearGradient id="colorJoin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke={axisColor} tick={{ fill: axisColor }} />
              <YAxis allowDecimals={false} stroke={axisColor} tick={{ fill: axisColor }} />
              <Tooltip
                content={<CustomTooltip />}
                labelFormatter={day => `${day} ${allMonths[selectedMonth].label}`}
                contentStyle={{
                  background: tooltipBg,
                  color: tooltipText,
                  border: "none",
                  borderRadius: 8,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
                labelStyle={{ color: labelColor }}
                itemStyle={{ color: labelColor }}
              />
              <Area
                type="monotone"
                dataKey="joined"
                stroke="#4CAF50"
                fill="url(#colorJoin)"
                name="Members Joined & Renewed"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
              <Area dataKey="newJoin" fill="transparent" stroke="none" />
              <Area dataKey="renewal" fill="transparent" stroke="none" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4" style={{ position: "relative" }}>
          <h2 className="text-lg font-bold mb-2">
            Members Join & ReNew Per Month
          </h2>
          <Box className="card-month-picker-box" sx={{ position: "absolute", right: 16, top: 16, zIndex: 1, display: "flex", gap: 2 }}>
            {/* Year selector */}
            <TextField
              select
              label="Year"
              size="small"
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              sx={{
                minWidth: 78,
                marginRight: 2,
                background: textFieldBg,
                borderRadius: 2,
                color: textFieldColor,
                "& .MuiInputBase-root": { color: textFieldColor },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: textFieldBorder },
                "& .MuiInputLabel-root": { color: labelColor },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: menuBg,
                      color: menuText,
                      "& .MuiMenuItem-root": {
                        "&:hover": { backgroundColor: menuHover, color: menuText }
                      }
                    }
                  }
                },
                style: { fontSize: 14 }
              }}
              InputLabelProps={{ style: { color: labelColor } }}
            >
              {allYearsArr.map(yr => (
                <MenuItem key={yr} value={yr}>
                  {yr}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Show message if there is no data for selected year/month */}
          {monthlyData.some(d => d.joined > 0)
            ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <defs>
                    <linearGradient id="newBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C853" stopOpacity={0.82} />
                      <stop offset="100%" stopColor="#8FE9B0" stopOpacity={0.45} />
                    </linearGradient>
                    <linearGradient id="renewBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#78bcf4ff" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#046fc7ff" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke={axisColor} tick={{ fill: axisColor }} />
                  <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
                  <Tooltip
                    content={<MonthBarTooltip />}
                    labelStyle={{ color: labelColor }}
                    itemStyle={{ color: labelColor }}
                    contentStyle={{
                      background: tooltipBg,
                      color: tooltipText,
                      border: "none",
                      borderRadius: 8,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                    }}
                    labelFormatter={month => `${month} ${selectedYear}`}
                  />
                  <Bar dataKey="newJoin" stackId="a" fill="url(#newBarGradient)" name="New Join" radius={[6, 6, 0, 0]} barSize={barSize} />
                  <Bar dataKey="renewal" stackId="a" fill="url(#renewBarGradient)" name="Renewal" radius={[6, 6, 0, 0]} barSize={barSize} />
                </BarChart>
              </ResponsiveContainer>
            )
            : (
              <div style={{ textAlign: "center", padding: "2rem", color: labelColor }}>
                No join or renewal data available for {selectedYear}.
              </div>
            )
          }
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-bold mb-2">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              {/* Linear Gradients */}
              <defs>
                {GRADIENTS_GENDER.map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={g.from} />
                    <stop offset="100%" stopColor={g.to} />
                  </linearGradient>
                ))}
              </defs>
              <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={100} label>
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gender${index % GRADIENTS_GENDER.length})`} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4" style={{ position: "relative" }}>
          <h2 className="text-lg font-bold mb-2">
            New vs ReNew Members in {allMonths[selectedPieMonth].label}
          </h2>
          {/* Month Picker specific for Pie Chart */}
          <Box className="card-month-picker-box" sx={{ position: "absolute", right: 16, top: 16, zIndex: 1 }}>
            <TextField
              select
              label="Month"
              size="small"
              value={selectedPieMonth}
              onChange={e => setSelectedPieMonth(Number(e.target.value))}
              sx={{
                minWidth: 110,
                background: textFieldBg,
                borderRadius: 2,
                color: textFieldColor,
                "& .MuiInputBase-root": { color: textFieldColor },
                "& .MuiOutlinedInput-notchedOutline": { borderColor: textFieldBorder },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDarkMode ? "#888" : "#999",
                },
                "& .MuiInputLabel-root": { color: labelColor },
              }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    sx: {
                      background: menuBg,
                      color: menuText,
                      "& .MuiMenuItem-root": {
                        "&:hover": { backgroundColor: menuHover, color: menuText }
                      }
                    }
                  }
                },
                style: { fontSize: 14 }
              }}
              InputLabelProps={{ style: { color: labelColor } }}
            >
              {allMonths
                .filter(m => m.value <= now.getMonth() || currentYear !== now.getFullYear())
                .map(month => (
                  <MenuItem
                    key={month.value}
                    value={month.value}
                    sx={{
                      background: menuBg,
                      color: menuText,
                      "&:hover": { backgroundColor: menuHover, color: menuText }
                    }}
                  >
                    {month.label}
                  </MenuItem>
                ))}
            </TextField>
          </Box>

          {hasPieData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                {/* SVG Gradients */}
                <defs>
                  {GRADIENTS_MEMBER_TYPE.map((g) => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={g.from} />
                      <stop offset="100%" stopColor={g.to} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={newVsReturning}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {newVsReturning.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#color${index % GRADIENTS_MEMBER_TYPE.length})`}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "2rem", color: labelColor }}>
              No new or renewed members for {allMonths[selectedPieMonth].label}.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}