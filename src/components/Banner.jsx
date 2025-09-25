
// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import { 
//   Sparkles, TrendingUp, BarChart2, PieChart, 
//   Factory, FlaskConical, DollarSign, Car, Code, HeartPulse, 
//   Scissors, ShoppingBag, Building2, Hammer
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const Banner = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-50px' });
//   const [sectors, setSectors] = useState([]);
//   const [selectedSector, setSelectedSector] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightedSector, setHighlightedSector] = useState(null);
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [maxPELessThan10Sector, setMaxPELessThan10Sector] = useState(null);
//   const [minPELessThan10Sector, setMinPELessThan10Sector] = useState(null);

//   const colorPalette = [
//     'rgba(56, 182, 255, 0.8)', 'rgba(0, 191, 255, 0.8)', 'rgba(100, 210, 255, 0.8)', 'rgba(0, 127, 255, 0.8)',
//     'rgba(30, 144, 255, 0.8)', 'rgba(70, 130, 180, 0.8)', 'rgba(65, 105, 225, 0.8)', 'rgba(0, 0, 255, 0.7)',
//     'rgba(25, 25, 112, 0.8)', 'rgba(138, 43, 226, 0.7)'
//   ];

//   const sectorIcons = {
//     'Capital Goods': Factory,
//     'Chemicals': FlaskConical, 
//     'Finance': DollarSign,
//     'Automobile & Ancillaries': Car, 
//     'IT': Code,
//     'Healthcare': HeartPulse,
//     'Textile': Scissors, 
//     'FMCG': ShoppingBag, 
//     'Infrastructure': Building2, 
//     'Iron & Steel': Hammer
//   };

//   const formatDecimal = (num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//     return Math.round(num * 100) / 100;
//   };

//   useEffect(() => {
//     const controller = new AbortController();
//     const cacheDuration = 10 * 60 * 1000; // 10 minutes
//     const fetchSectors = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setSectors([]);

//         const cachedData = localStorage.getItem('sectorData');
//         const cacheTimestamp = localStorage.getItem('sectorDataTimestamp');
//         let validSectors = [];

//         if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//           const parsedData = JSON.parse(cachedData);
//           validSectors = parsedData
//             .filter((sector) => sector && sector.Sector && typeof sector.SectorMarketCap === 'number' && Array.isArray(sector.Companies))
//             .map((sector, index) => {
//               const peLessThan10Count = sector.Companies.filter(company => company.PE != null && !isNaN(company.PE) && company.PE < 10).length;
//               return {
//                 ...sector,
//                 color: colorPalette[index % colorPalette.length],
//                 highlightColor: colorPalette[index % colorPalette.length].replace('0.8)', '1)'),
//                 PELessThan10Count: peLessThan10Count,
//                 TotalCompanies: sector.Companies.length
//               };
//             });
//         } else {
//           const response = await axios.get(`${API_BASE}/landpage/sector-summary`, { signal: controller.signal });
//           if (!Array.isArray(response.data)) {
//             throw new Error('API response is not an array');
//           }
//           validSectors = response.data
//             .filter((sector) => sector && sector.Sector && typeof sector.SectorMarketCap === 'number' && Array.isArray(sector.Companies))
//             .map((sector, index) => {
//               const peLessThan10Count = sector.Companies.filter(company => company.PE != null && !isNaN(company.PE) && company.PE < 10).length;
//               return {
//                 ...sector,
//                 color: colorPalette[index % colorPalette.length],
//                 highlightColor: colorPalette[index % colorPalette.length].replace('0.8)', '1)'),
//                 PELessThan10Count: peLessThan10Count,
//                 TotalCompanies: sector.Companies.length
//               };
//             });
//           localStorage.setItem('sectorData', JSON.stringify(response.data));
//           localStorage.setItem('sectorDataTimestamp', Date.now().toString());
//         }

//         if (validSectors.length === 0) {
//           setSectors([]);
//           setSelectedSector(null);
//           setMaxPELessThan10Sector(null);
//           setMinPELessThan10Sector(null);
//           setLoading(false);
//           return;
//         }

//         const sortedSectors = [...validSectors].sort((a, b) => {
//           return sortOrder === 'desc' ? b.SectorMarketCap - a.SectorMarketCap : a.SectorMarketCap - b.SectorMarketCap;
//         }).slice(0, 10);

//         setSectors(sortedSectors);

//         const maxPELessThan10Sector = validSectors.reduce((max, sector) => {
//           if (!max) return sector;
//           if (sector.PELessThan10Count === max.PELessThan10Count) {
//             return sector.TotalCompanies < max.TotalCompanies ? sector : max;
//           }
//           return sector.PELessThan10Count > max.PELessThan10Count ? sector : max;
//         }, validSectors[0]);

//         const minPELessThan10Sector = validSectors.reduce((min, sector) => {
//           if (!min) return sector;
//           if (sector.PELessThan10Count === min.PELessThan10Count) {
//             return sector.TotalCompanies < min.TotalCompanies ? sector : min;
//           }
//           return sector.PELessThan10Count < min.PELessThan10Count ? sector : min;
//         }, validSectors[0]);

//         setMaxPELessThan10Sector(maxPELessThan10Sector);
//         setMinPELessThan10Sector(minPELessThan10Sector);

//         if (sortedSectors.length > 0) {
//           setSelectedSector(sortedSectors[0]);
//         } else {
//           setSelectedSector(null);
//         }
//         setLoading(false);
//       } catch (error) {
//         if (error.name === 'AbortError') return;
//         setError(error.message || 'Failed to fetch sector data');
//         console.error('Error fetching sector data:', error, error.response?.data);
//         setSectors([]);
//         setSelectedSector(null);
//         setMaxPELessThan10Sector(null);
//         setMinPELessThan10Sector(null);
//         setLoading(false);
//       }
//     };

//     const debounceFetch = setTimeout(() => fetchSectors(), 100);
//     return () => {
//       controller.abort();
//       clearTimeout(debounceFetch);
//     };
//   }, [API_BASE, sortOrder]);

//   const formatNumber = useCallback((num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') {
//       return '₹0';
//     }
//     const absNum = Math.abs(num);
//     const sign = num < 0 ? '-' : '';
//     if (absNum >= 1e7) {
//       const value = absNum / 1e7;
//       return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}cr`;
//     }
//     if (absNum >= 1e5) {
//       const value = absNum / 1e5;
//       return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}L`;
//     }
//     return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//   }, []);

//   const totalMarketCap = useMemo(() => {
//     return sectors.reduce((sum, sector) => sum + (sector.SectorMarketCap || 0), 0);
//   }, [sectors]);

//   const pieChartData = useMemo(() => {
//     if (!Array.isArray(sectors) || sectors.length === 0) {
//       return {
//         labels: ['No Data'],
//         datasets: [{
//           data: [1],
//           backgroundColor: ['rgba(200, 200, 200, 0.5)'],
//           borderWidth: 1,
//           hoverOffset: 0
//         }]
//       };
//     }
//     return {
//       labels: sectors.map(sector => sector.Sector || 'Unknown'),
//       datasets: [{
//         data: sectors.map(sector => sector.SectorMarketCap || 0),
//         backgroundColor: sectors.map((sector, index) => highlightedSector === index ? sector.highlightColor : sector.color),
//         borderWidth: 1,
//         hoverOffset: 20
//       }]
//     };
//   }, [sectors, highlightedSector]);

//   const loaderPieChartData = useMemo(() => ({
//     labels: ['Loading...', 'Loading...', 'Loading...', 'Loading...', 'Loading...'],
//     datasets: [{
//       data: [1, 1, 1, 1, 1],
//       backgroundColor: [
//         'rgba(200, 200, 200, 0.5)',
//         'rgba(180, 180, 180, 0.5)',
//         'rgba(160, 160, 160, 0.5)',
//         'rgba(140, 140, 140, 0.5)',
//         'rgba(120, 120, 120, 0.5)'
//       ],
//       borderWidth: 1,
//       borderColor: 'rgba(255, 255, 255, 0.5)'
//     }]
//   }), []);

//   const centerTextPlugin = {
//     id: 'centerText',
//     afterDraw(chart) {
//       const { ctx, chartArea: { width, height } } = chart;
//       ctx.save();
//       ctx.font = 'bold 14px Arial';
//       ctx.fillStyle = '#333';
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillText('Market Cap', width / 2, height / 2);
//       ctx.restore();
//     }
//   };

//   const pieChartOptions = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: '60%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           color: '#333',
//           font: { size: 11, weight: 'bold' },
//           padding: 8,
//           usePointStyle: true
//         }
//       },
//       tooltip: {
//         enabled: Array.isArray(sectors) && sectors.length > 0,
//         callbacks: {
//           label: function (context) {
//             const label = context.label || '';
//             if (label === 'No Data') return 'No data available';
//             const value = context.raw || 0;
//             const percentage = totalMarketCap > 0 ? ((value / totalMarketCap) * 100).toFixed(1) : 0;
//             return `${label}: ${formatNumber(value)} (${percentage}%)`;
//           }
//         }
//       }
//     },
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart'
//     },
//     onClick: (event, elements) => {
//       if (!loading && elements?.length > 0 && Array.isArray(sectors) && sectors.length > 0) {
//         const clickedIndex = elements[0].index;
//         if (clickedIndex < sectors.length) {
//           setSelectedSector(sectors[clickedIndex]);
//           setHighlightedSector(clickedIndex);
//         }
//       }
//     }
//   }), [formatNumber, loading, sectors, totalMarketCap]);

//   const toggleSortOrder = () => {
//     setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
//   };

//   return (
//     <div className="mt-8 relative px-2 py-4 flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-black min-h-[60vh]">
//       <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 z-10">
//         <motion.div
//           className="w-full lg:w-2/5 text-gray-800 dark:text-white text-center lg:text-left"
//           initial={{ opacity: 0, y: 20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="mt-10 flex items-center justify-center lg:justify-start gap-2 text-slate-700 dark:text-indigo-400 text-sm font-medium">
//             <Sparkles className="w-4 h-4" />
//             <span>Sector Intelligence Platform</span>
//           </div>

//           <h1 className="mt-2 text-2xl md:text-3xl font-extrabold leading-tight">
//             Capital Market Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400">Analysis Hub</span>
//           </h1>

//           <p className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0">
//             <Typewriter
//               words={[
//                 'Warren Buffett - "You do things when opportunities come along"',
//                 'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                 'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                 'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                 'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                 'Charlie Munger - "People calculate too much and think too little"'
//               ]}
//               loop={0}
//               cursor
//               cursorStyle="|"
//               typeSpeed={60}
//               deleteSpeed={30}
//               delaySpeed={1500}
//             />
//           </p>

//           <button
//             onClick={toggleSortOrder}
//             disabled={loading}
//             className={`mt-3 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700'}`}
//           >
//             Sort by Market Cap: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
//           </button>

//           <AnimatePresence>
//             {loading ? (
//               <motion.div
//                 className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="animate-pulse">
//                   <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
//                   <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
//                   <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
//                   <div className="grid grid-cols-2 gap-2">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2.5 rounded-lg">
//                         <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
//                         <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ) : !selectedSector || sectors.length === 0 ? (
//               <motion.div
//                 className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
//                   No sector data available
//                 </div>
//               </motion.div>
//             ) : (
//               <motion.div
//                 className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="p-3">
//                   <div className="flex items-center gap-2 mb-3">
//                     <motion.div
//                       className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
//                       style={{
//                         backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
//                         color: 'white'
//                       }}
//                       whileHover={{ scale: 1.05 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                     >
//                       {sectorIcons[selectedSector.Sector] ? (
//                         React.createElement(sectorIcons[selectedSector.Sector], {
//                           className: "w-4 h-4",
//                           strokeWidth: 1.5
//                         })
//                       ) : (
//                         <PieChart className="w-4 h-4" strokeWidth={1.5} />
//                       )}
//                     </motion.div>
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//                         {selectedSector.Sector}
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
//                         {selectedSector.description || 'Sector performance overview'}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2 px-3 pb-3">
//                   <div className="space-y-2">
//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-2.5 rounded-lg border border-blue-100 dark:border-gray-600">
//                       <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                         <PieChart className="w-3.5 h-3.5 opacity-70" />
//                         <span>Market Cap</span>
//                       </div>
//                       <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                         {formatNumber(selectedSector.SectorMarketCap)}
//                       </div>
//                     </div>
//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-2.5 rounded-lg border border-green-100 dark:border-gray-600">
//                       <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                         <TrendingUp className="w-3.5 h-3.5 opacity-70" />
//                         <span>1Y Growth</span>
//                       </div>
//                       <div className={`text-sm font-semibold ${
//                         selectedSector.SectorCAGR_TTM_YoY >= 0
//                           ? 'text-green-600 dark:text-green-400'
//                           : 'text-red-600 dark:text-red-400'
//                       }`}>
//                         {selectedSector.SectorCAGR_TTM_YoY
//                           ? `${formatDecimal(selectedSector.SectorCAGR_TTM_YoY * 100)}%`
//                           : 'N/A'}
//                       </div>
//                     </div>
//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-2.5 rounded-lg border border-purple-100 dark:border-gray-600">
//                       <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                         <BarChart2 className="w-3.5 h-3.5 opacity-70" />
//                         <span>PE Ratio</span>
//                       </div>
//                       <div className="text-sm font-semibold text-gray-900 dark:text-white">
//                         {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//                       Companies with PE &lt; 10
//                     </h4>
//                     {maxPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-2.5 rounded-lg border border-sky-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md hover:ring-1 hover:ring-sky-300/50 transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Highest Count</p>
//                             <p className="text-sm font-medium text-gray-900 dark:text-white">
//                               {maxPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-sky-100 dark:bg-sky-900/50 rounded-full text-sky-800 dark:text-sky-100 text-xs font-medium">
//                             {maxPELessThan10Sector.PELessThan10Count}/{maxPELessThan10Sector.TotalCompanies} {maxPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         No sectors available
//                       </div>
//                     )}
//                     {minPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-purple-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-2.5 rounded-lg border border-purple-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md hover:ring-1 hover:ring-purple-300/50 transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4, delay: 0.1 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Lowest Count</p>
//                             <p className="text-sm font-medium text-gray-900 dark:text-white">
//                               {minPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-purple-800 dark:text-purple-100 text-xs font-medium">
//                             {minPELessThan10Sector.PELessThan10Count}/{minPELessThan10Sector.TotalCompanies} {minPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <div className="text-xs text-gray-500 dark:text-gray-400">
//                         No sectors available
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </motion.div>

//         <div className="ml-40 w-full lg:w-3/5 h-[360px] relative mt-6" data-tour="home-hero">
//           {error ? (
//             <div className="text-center px-4 py-5 text-gray-500 dark:text-gray-300 text-sm">Could not load sector visualization: {error}</div>
//           ) : (
//             <Pie
//               data={loading ? loaderPieChartData : pieChartData}
//               options={pieChartOptions}
//               plugins={[centerTextPlugin]}
//             />
//           )}
//           <div className="text-center mt-2 text-xs text-gray-600 dark:text-gray-400">
//             <p className="text-sky-600 dark:text-sky-400 font-medium dark:text-white">
//               Showing top 10 sectors by Market Cap ({sortOrder === 'desc' ? 'highest to lowest' : 'lowest to highest'})
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;

// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import {
//   Sparkles, TrendingUp, BarChart2, PieChart,
//   Factory, FlaskConical, DollarSign, Car, Code, HeartPulse,
//   Scissors, ShoppingBag, Building2, Hammer
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const Banner = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-50px' });
//   const [sectors, setSectors] = useState([]);
//   const [selectedSector, setSelectedSector] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightedSector, setHighlightedSector] = useState(null);
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [maxPELessThan10Sector, setMaxPELessThan10Sector] = useState(null);
//   const [minPELessThan10Sector, setMinPELessThan10Sector] = useState(null);

//   const colorPalette = [
//     'rgba(56, 182, 255, 0.8)', 'rgba(0, 191, 255, 0.8)', 'rgba(100, 210, 255, 0.8)', 'rgba(0, 127, 255, 0.8)',
//     'rgba(30, 144, 255, 0.8)', 'rgba(70, 130, 180, 0.8)', 'rgba(65, 105, 225, 0.8)', 'rgba(0, 0, 255, 0.7)',
//     'rgba(25, 25, 112, 0.8)', 'rgba(138, 43, 226, 0.7)'
//   ];

//   const sectorIcons = {
//     'Capital Goods': Factory,
//     'Chemicals': FlaskConical,
//     'Finance': DollarSign,
//     'Automobile & Ancillaries': Car,
//     'IT': Code,
//     'Healthcare': HeartPulse,
//     'Textile': Scissors,
//     'FMCG': ShoppingBag,
//     'Infrastructure': Building2,
//     'Iron & Steel': Hammer
//   };

//   const formatDecimal = (num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//     return Math.round(num * 100) / 100;
//   };

//   useEffect(() => {
//     const controller = new AbortController();
//     const cacheDuration = 60 * 60 * 1000; // 1hr
//     const fetchSectors = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setSectors([]);

//         const cachedData = localStorage.getItem('sectorData');
//         const cacheTimestamp = localStorage.getItem('sectorDataTimestamp');
//         let validSectors = [];

//         if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//           const parsedData = JSON.parse(cachedData);
//           validSectors = parsedData
//             .filter((sector) => sector && sector.Sector && typeof sector.SectorMarketCap === 'number' && Array.isArray(sector.Companies))
//             .map((sector, index) => {
//               const peLessThan10Count = sector.Companies.filter(company => company.PE != null && !isNaN(company.PE) && company.PE < 10).length;
//               return {
//                 ...sector,
//                 color: colorPalette[index % colorPalette.length],
//                 highlightColor: colorPalette[index % colorPalette.length].replace('0.8)', '1)'),
//                 PELessThan10Count: peLessThan10Count,
//                 TotalCompanies: sector.Companies.length
//               };
//             });
//         } else {
//           const response = await axios.get(`${API_BASE}/landpage/sector-summary`, { signal: controller.signal });
//           if (!Array.isArray(response.data)) {
//             throw new Error('API response is not an array');
//           }
//           validSectors = response.data
//             .filter((sector) => sector && sector.Sector && typeof sector.SectorMarketCap === 'number' && Array.isArray(sector.Companies))
//             .map((sector, index) => {
//               const peLessThan10Count = sector.Companies.filter(company => company.PE != null && !isNaN(company.PE) && company.PE < 10).length;
//               return {
//                 ...sector,
//                 color: colorPalette[index % colorPalette.length],
//                 highlightColor: colorPalette[index % colorPalette.length].replace('0.8)', '1)'),
//                 PELessThan10Count: peLessThan10Count,
//                 TotalCompanies: sector.Companies.length
//               };
//             });
//           localStorage.setItem('sectorData', JSON.stringify(response.data));
//           localStorage.setItem('sectorDataTimestamp', Date.now().toString());
//         }

//         if (validSectors.length === 0) {
//           setSectors([]);
//           setSelectedSector(null);
//           setMaxPELessThan10Sector(null);
//           setMinPELessThan10Sector(null);
//           setLoading(false);
//           return;
//         }

//         const sortedSectors = [...validSectors].sort((a, b) => {
//           return sortOrder === 'desc' ? b.SectorMarketCap - a.SectorMarketCap : a.SectorMarketCap - b.SectorMarketCap;
//         }).slice(0, 10);

//         setSectors(sortedSectors);

//         const maxPELessThan10Sector = validSectors.reduce((max, sector) => {
//           if (!max) return sector;
//           if (sector.PELessThan10Count === max.PELessThan10Count) {
//             return sector.TotalCompanies < max.TotalCompanies ? sector : max;
//           }
//           return sector.PELessThan10Count > max.PELessThan10Count ? sector : max;
//         }, validSectors[0]);

//         const minPELessThan10Sector = validSectors.reduce((min, sector) => {
//           if (!min) return sector;
//           if (sector.PELessThan10Count === min.PELessThan10Count) {
//             return sector.TotalCompanies < min.TotalCompanies ? sector : min;
//           }
//           return sector.PELessThan10Count < min.PELessThan10Count ? sector : min;
//         }, validSectors[0]);

//         setMaxPELessThan10Sector(maxPELessThan10Sector);
//         setMinPELessThan10Sector(minPELessThan10Sector);

//         if (sortedSectors.length > 0) {
//           setSelectedSector(sortedSectors[0]);
//         } else {
//           setSelectedSector(null);
//         }
//         setLoading(false);
//       } catch (error) {
//         if (error.name === 'AbortError') return;
//         setError(error.message || 'Failed to fetch sector data');
//         console.error('Error fetching sector data:', error, error.response?.data);
//         setSectors([]);
//         setSelectedSector(null);
//         setMaxPELessThan10Sector(null);
//         setMinPELessThan10Sector(null);
//         setLoading(false);
//       }
//     };

//     const debounceFetch = setTimeout(() => fetchSectors(), 100);
//     return () => {
//       controller.abort();
//       clearTimeout(debounceFetch);
//     };
//   }, [API_BASE, sortOrder]);

//   const formatNumber = useCallback((num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') {
//       return '₹0';
//     }
//     const absNum = Math.abs(num);
//     const sign = num < 0 ? '-' : '';
//     if (absNum >= 1e7) {
//       const value = absNum / 1e7;
//       return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}cr`;
//     }
//     if (absNum >= 1e5) {
//       const value = absNum / 1e5;
//       return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}L`;
//     }
//     return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//   }, []);

//   const totalMarketCap = useMemo(() => {
//     return sectors.reduce((sum, sector) => sum + (sector.SectorMarketCap || 0), 0);
//   }, [sectors]);

//   const pieChartData = useMemo(() => {
//     if (!Array.isArray(sectors) || sectors.length === 0) {
//       return {
//         labels: ['No Data'],
//         datasets: [{
//           data: [1],
//           backgroundColor: ['rgba(200, 200, 200, 0.5)'],
//           borderWidth: 1,
//           hoverOffset: 0
//         }]
//       };
//     }
//     return {
//       labels: sectors.map(sector => sector.Sector || 'Unknown'),
//       datasets: [{
//         data: sectors.map(sector => sector.SectorMarketCap || 0),
//         backgroundColor: sectors.map((sector, index) => highlightedSector === index ? sector.highlightColor : sector.color),
//         borderWidth: 1,
//         hoverOffset: 20
//       }]
//     };
//   }, [sectors, highlightedSector]);

//   const loaderPieChartData = useMemo(() => ({
//     labels: ['Loading...', 'Loading...', 'Loading...', 'Loading...', 'Loading...'],
//     datasets: [{
//       data: [1, 1, 1, 1, 1],
//       backgroundColor: [
//         'rgba(200, 200, 200, 0.5)',
//         'rgba(180, 180, 180, 0.5)',
//         'rgba(160, 160, 160, 0.5)',
//         'rgba(140, 140, 140, 0.5)',
//         'rgba(120, 120, 120, 0.5)'
//       ],
//       borderWidth: 1,
//       borderColor: 'rgba(255, 255, 255, 0.5)'
//     }]
//   }), []);

//   const centerTextPlugin = {
//     id: 'centerText',
//     afterDraw(chart) {
//       const { ctx, chartArea: { width, height } } = chart;
//       ctx.save();
//       ctx.font = 'bold 12px Arial';
//       ctx.fillStyle = '#333';
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillText('Market Cap', width / 2, height / 2);
//       ctx.restore();
//     }
//   };

//   // const pieChartOptions = useMemo(() => ({
//   //   responsive: true,
//   //   maintainAspectRatio: false,
//   //   cutout: '60%',
//   //   plugins: {
//   //     legend: {
//   //       position: 'bottom',
//   //       labels: {
//   //         color: '#333',
//   //         font: { size: 10, weight: 'bold' },
//   //         padding: 6,
//   //         usePointStyle: true,
//   //         generateLabels: (chart) => {
//   //           const data = chart.data;
//   //           return data.labels.map((label, i) => ({
//   //             text: label.length > 15 ? `${label.slice(0, 12)}...` : label,
//   //             fillStyle: data.datasets[0].backgroundColor[i],
//   //             strokeStyle: data.datasets[0].backgroundColor[i],
//   //             lineWidth: 1,
//   //             hidden: false,
//   //             index: i,
//   //             pointStyle: 'circle'
//   //           }));
//   //         }
//   //       }
//   //     },
//   //     tooltip: {
//   //       enabled: Array.isArray(sectors) && sectors.length > 0,
//   //       callbacks: {
//   //         label: function (context) {
//   //           const label = context.label || '';
//   //           if (label === 'No Data') return 'No data available';
//   //           const value = context.raw || 0;
//   //           const percentage = totalMarketCap > 0 ? ((value / totalMarketCap) * 100).toFixed(1) : 0;
//   //           return `${label}: ${formatNumber(value)} (${percentage}%)`;
//   //         }
//   //       }
//   //     }
//   //   },
//   //   animation: {
//   //     duration: 1000,
//   //     easing: 'easeOutQuart'
//   //   },
//   //   onClick: (event, elements) => {
//   //     if (!loading && elements?.length > 0 && Array.isArray(sectors) && sectors.length > 0) {
//   //       const clickedIndex = elements[0].index;
//   //       if (clickedIndex < sectors.length) {
//   //         setSelectedSector(sectors[clickedIndex]);
//   //         setHighlightedSector(clickedIndex);
//   //       }
//   //     }
//   //   }
//   // }), [formatNumber, loading, sectors, totalMarketCap]);

//   const pieChartOptions = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: '60%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           color: '#333',
//           font: { size: 10, weight: 'bold' },
//           padding: 8,
//           usePointStyle: true
//         }
//       },
//       tooltip: {
//         enabled: Array.isArray(sectors) && sectors.length > 0,
//         callbacks: {
//           label: function (context) {
//             const label = context.label || '';
//             if (label === 'No Data') return 'No data available';
//             const value = context.raw || 0;
//             const percentage = totalMarketCap > 0 ? ((value / totalMarketCap) * 100).toFixed(1) : 0;
//             return `${label}: ${formatNumber(value)} (${percentage}%)`;
//           }
//         }
//       }
//     },
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart'
//     },
//     onClick: (event, elements) => {
//       if (!loading && elements?.length > 0 && Array.isArray(sectors) && sectors.length > 0) {
//         const clickedIndex = elements[0].index;
//         if (clickedIndex < sectors.length) {
//           setSelectedSector(sectors[clickedIndex]);
//           setHighlightedSector(clickedIndex);
//         }
//       }
//     }
//   }), [formatNumber, loading, sectors, totalMarketCap]);

//   const toggleSortOrder = () => {
//     setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
//   };

//   return (
//     <div className="relative px-4 py-6 flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
//       <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 z-10">
//         <div
//           className="mt-5 w-full text-gray-800 dark:text-gray-100 text-center lg:text-left"
//           initial={{ opacity: 0, y: 20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-start gap-2 text-slate-700 dark:text-indigo-300 text-xs sm:text-sm font-medium">
//             <Sparkles className="w-4 h-4" />
//             <span>Sector Intelligence Platform</span>
//           </div>

//           <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">
//             Capital Market Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">Analysis Hub</span>
//           </h1>

//           <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0">
//             <Typewriter
//               words={[
//                 'Warren Buffett - "You do things when opportunities come along"',
//                 'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                 'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                 'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                 'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                 'Charlie Munger - "People calculate too much and think too little"'
//               ]}
//               loop={0}
//               cursor
//               cursorStyle="|"
//               typeSpeed={60}
//               deleteSpeed={30}
//               delaySpeed={1500}
//             />
//           </p>

//           <button
//             onClick={toggleSortOrder}
//             disabled={loading}
//             className={`mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700'}`}
//           >
//             Sort by Market Cap: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
//           </button>

//           {/* <AnimatePresence>
//             {loading ? (
//               <motion.div
//                 className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-3 sm:p-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="animate-pulse">
//                   <div className="h-6 sm:h-8 w-6 sm:w-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 sm:mb-4"></div>
//                   <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
//                   <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3 sm:mb-4"></div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-2.5 rounded-lg">
//                         <div className="h-2 sm:h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
//                         <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ) : !selectedSector || sectors.length === 0 ? (
//               <motion.div
//                 className="mt-4 sm:mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-3 sm:p-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="text-center text-gray-500 dark:text-gray-300 text-xs sm:text-sm">
//                   No sector data available
//                 </div>
//               </motion.div>
//             ) : (
//               <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mx-auto lg:mx-0">
//                 <motion.div
//                   className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden w-full p-3 sm:p-4 flex flex-col"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="flex items-center w-full gap-2 mb-3 sm:mb-4">
//                     <motion.div
//                       className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg flex items-center justify-center shadow-sm"
//                       style={{
//                         backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
//                         color: 'white'
//                       }}
//                       whileHover={{ scale: 1.05 }}
//                       transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                     >
//                       {sectorIcons[selectedSector.Sector] ? (
//                         React.createElement(sectorIcons[selectedSector.Sector], {
//                           className: "w-3.5 sm:w-4 h-3.5 sm:h-4",
//                           strokeWidth: 1.5
//                         })
//                       ) : (
//                         <PieChart className="w-3.5 sm:w-4 h-3.5 sm:h-4" strokeWidth={1.5} />
//                       )}
//                     </motion.div>
//                     <div className="flex-1">
//                       <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
//                         {selectedSector.Sector}
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">
//                         {selectedSector.description || 'Sector performance overview'}
//                       </p>
//                     </div>
//                   </div>

//                   {/* <div className="flex flex-row w-full gap-2 sm:gap-3 flex-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
//                     <div className="min-w-[120px] sm:min-w-[140px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-blue-100 dark:border-gray-600">
//                       <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                         <PieChart className="w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-70" />
//                         <span>Market Cap</span>
//                       </div>
//                       <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
//                         {formatNumber(selectedSector.SectorMarketCap)}
//                       </div>
//                     </div>

//                     <div className="min-w-[120px] sm:min-w-[140px] bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-green-100 dark:border-gray-600">
//                       <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                         <TrendingUp className="w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-70" />
//                         <span>1Y Growth</span>
//                       </div>
//                       <div
//                         className={`text-xs sm:text-sm font-semibold ${
//                           selectedSector.SectorCAGR_TTM_YoY >= 0
//                             ? 'text-green-600 dark:text-green-400'
//                             : 'text-red-600 dark:text-red-400'
//                         }`}
//                       >
//                         {selectedSector.SectorCAGR_TTM_YoY
//                           ? `${formatDecimal(selectedSector.SectorCAGR_TTM_YoY * 100)}%`
//                           : 'N/A'}
//                       </div>
//                     </div>

//                     <div className="min-w-[120px] sm:min-w-[140px] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-purple-100 dark:border-gray-600">
//                       <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                         <BarChart2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-70" />
//                         <span>PE Ratio</span>
//                       </div>
//                       <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
//                         {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                       </div>
//                     </div>
//                   </div> *
//                   <div className="flex flex-wrap w-full gap-2 sm:gap-3 flex-1">
//                       <div className="flex-1 min-w-[100px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-blue-100 dark:border-gray-600">
//                         <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                           <PieChart className="w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-70" />
//                           <span>Market Cap</span>
//                         </div>
//                         <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
//                           {formatNumber(selectedSector.SectorMarketCap)}
//                         </div>
//                       </div>

//                       <div className="flex-1 min-w-[100px] bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-green-100 dark:border-gray-600">
//                         <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                           <TrendingUp className="w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-70" />
//                           <span>1Y Growth</span>
//                         </div>
//                         <div
//                           className={`text-xs sm:text-sm font-semibold ${
//                             selectedSector.SectorCAGR_TTM_YoY >= 0
//                               ? 'text-green-600 dark:text-green-400'
//                               : 'text-red-600 dark:text-red-400'
//                           }`}
//                         >
//                           {selectedSector.SectorCAGR_TTM_YoY
//                             ? `${formatDecimal(selectedSector.SectorCAGR_TTM_YoY * 100)}%`
//                             : 'N/A'}
//                         </div>
//                       </div>

//                       <div className="flex-1 min-w-[100px] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-purple-100 dark:border-gray-600">
//                         <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-xs font-medium mb-1">
//                           <BarChart2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 opacity-70" />
//                           <span>PE Ratio</span>
//                         </div>
//                         <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
//                           {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                         </div>
//                       </div>
//                     </div>

//                 </motion.div>

//                 <motion.div
//                   className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden w-full p-3 sm:p-4 flex flex-col"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0 }}
//                   transition={{ duration: 0.3, delay: 0.1 }}
//                 >
//                   <h4 className="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2 sm:mb-3">
//                     Companies with PE &lt; 10
//                   </h4>
//                   <div className="flex flex-col gap-2 sm:gap-3 flex-1">
//                     {maxPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-sky-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md hover:ring-1 hover:ring-sky-300/50 transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-300">Highest Count</p>
//                             <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
//                               {maxPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-sky-100 dark:bg-sky-900/50 rounded-full text-sky-800 dark:text-sky-100 text-xs font-medium">
//                             {maxPELessThan10Sector.PELessThan10Count}/{maxPELessThan10Sector.TotalCompanies} {maxPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <div className="text-xs text-gray-500 dark:text-gray-300">
//                         No sectors available
//                       </div>
//                     )}
//                     {minPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-purple-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-2 sm:p-2.5 rounded-lg border border-purple-200/50 dark:border-gray-600/50 shadow-sm hover:shadow-md hover:ring-1 hover:ring-purple-300/50 transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4, delay: 0.1 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-300">Lowest Count</p>
//                             <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">
//                               {minPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-purple-800 dark:text-purple-100 text-xs font-medium">
//                             {minPELessThan10Sector.PELessThan10Count}/{minPELessThan10Sector.TotalCompanies} {minPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <div className="text-xs text-gray-500 dark:text-gray-300">
//                         No sectors available
//                       </div>
//                     )}
//                   </div>
//                 </motion.div>
//               </div>
//             )}
//           </AnimatePresence> */}
//           <AnimatePresence mode="wait">
//             {loading ? (
//               <motion.div
//                 key="loading"
//                 className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="animate-pulse flex flex-col items-center space-y-4">
//                   <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
//                   <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="grid grid-cols-2 gap-3 w-full">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col space-y-1">
//                         <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                         <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ) : !selectedSector || sectors.length === 0 ? (
//               <motion.div
//                 key="no-data"
//                 className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4 text-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
//                   No sector data available
//                 </p>

//               </motion.div>
//             ) : (
//               <motion.div
//                 key="data"
//                 className="mt-6 flex flex-col gap-4 w-full mx-auto lg:mx-0"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {/* Sector Overview Card */}
//                 <motion.div
//                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4 flex flex-col"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.1, duration: 0.3 }}
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <motion.div
//                       className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
//                       style={{
//                         backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
//                         color: 'white',
//                       }}
//                       whileHover={{ scale: 1.1 }}
//                       transition={{ type: "spring", stiffness: 300, damping: 10 }}
//                     >
//                       {sectorIcons[selectedSector.Sector] ? (
//                         React.createElement(sectorIcons[selectedSector.Sector], {
//                           className: "w-5 h-5",
//                           strokeWidth: 1.5,
//                         })
//                       ) : (
//                         <PieChart className="w-5 h-5" strokeWidth={1.5} />
//                       )}
//                     </motion.div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                         {selectedSector.Sector}
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {selectedSector.description || 'Sector performance overview'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-600">
//                       <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                         <PieChart className="w-4 h-4 opacity-70" />
//                         Market Cap
//                       </div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                         {formatNumber(selectedSector.SectorMarketCap)}
//                       </p>
//                     </div>
//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-green-100 dark:border-gray-600">
//                       <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                         <TrendingUp className="w-4 h-4 opacity-70" />
//                         1Y Growth
//                       </div>
//                       <p
//                         className={`text-sm font-medium ${selectedSector.SectorCAGR_1Y >= 0
//                           ? 'text-green-600 dark:text-green-400'
//                           : 'text-red-600 dark:text-red-400'
//                           }`}
//                       >
//                         {selectedSector.SectorCAGR_1Y
//                           ? `${formatDecimal(selectedSector.SectorCAGR_1Y * 100)}%`
//                           : 'N/A'}
//                       </p>
//                     </div>
//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-100 dark:border-gray-600">
//                       <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                         <BarChart2 className="w-4 h-4 opacity-70" />
//                         PE Ratio
//                       </div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                         {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Companies with PE < 10 Card */}
//                 <motion.div
//                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4 flex flex-col"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2, duration: 0.3 }}
//                 >
//                   <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
//                     Companies with PE less than 10 ratio
//                   </h4>
//                   <div className="flex flex-col gap-3 flex-1">
//                     {maxPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-sky-200/50 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Highest Count</p>
//                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                               {maxPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-sky-100 dark:bg-sky-900/50 rounded-full text-sky-800 dark:text-sky-100 text-xs font-medium">
//                             {maxPELessThan10Sector.PELessThan10Count}/{maxPELessThan10Sector.TotalCompanies}{' '}
//                             {maxPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <p className="text-xs text-gray-500 dark:text-gray-400 text-center">No data available</p>
//                     )}
//                     {minPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-200/50 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4, delay: 0.1 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Lowest Count</p>
//                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                               {minPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-purple-800 dark:text-purple-100 text-xs font-medium">
//                             {minPELessThan10Sector.PELessThan10Count}/{minPELessThan10Sector.TotalCompanies}{' '}
//                             {minPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <p className="text-xs text-gray-500 dark:text-gray-400 text-center">No data available</p>
//                     )}
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         <div className="w-full  lg:w-2/5 h-[280px] sm:h-[320px] md:h-[360px] relative mt-4 sm:mt-6" data-tour="home-hero">
//           {error ? (
//             <div className="text-center px-4 py-5 text-gray-500 dark:bg-slate-800 dark:text-gray-300 text-xs sm:text-sm">Could not load sector visualization: {error}</div>
//           ) : (
//             <Pie
//               data={loading ? loaderPieChartData : pieChartData}
//               options={pieChartOptions}
//               plugins={[centerTextPlugin]}
//             />
//           )}
//           <div className="text-center mt-2 text-xs text-gray-600 dark:text-gray-300">
//             <p className="text-sky-600 dark:text-sky-300 font-medium">
//               Showing top 10 sectors by Market Cap ({sortOrder === 'desc' ? 'highest to lowest' : 'lowest to highest'})
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;


// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import {
//   Sparkles, TrendingUp, BarChart2, PieChart,
//   Factory, FlaskConical, DollarSign, Car, Code, HeartPulse,
//   Scissors, ShoppingBag, Building2, Hammer
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';
// import { Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const Banner = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-50px' });
//   const [sectors, setSectors] = useState([]);
//   const [selectedSector, setSelectedSector] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightedSector, setHighlightedSector] = useState(null);
//   const [sortOrder, setSortOrder] = useState('desc');
//   const [maxPELessThan10Sector, setMaxPELessThan10Sector] = useState(null);
//   const [minPELessThan10Sector, setMinPELessThan10Sector] = useState(null);
//   const [isDark, setIsDark] = useState(false);

//   const colorPalette = [
//     'rgba(31, 119, 180, 0.8)',   // Blue
//     'rgba(255, 127, 14, 0.8)',   // Orange
//     'rgba(13, 84, 105, 0.8)',    // Green
//     'rgba(214, 39, 40, 0.8)',    // Red
//     'rgba(148, 103, 189, 0.8)',  // Purple
//     'rgba(23, 190, 207, 0.8)',   // Teal
//     'rgba(227, 119, 194, 0.8)',  // Pink
//     'rgba(188, 189, 34, 0.8)',   // Yellow
//     'rgba(127, 127, 127, 0.8)',  // Grey
//     'rgba(70, 130, 180, 0.8)'    // Steel Blue
//   ];

//   const sectorIcons = {
//     'Capital Goods': Factory,
//     'Chemicals': FlaskConical,
//     'Finance': DollarSign,
//     'Automobile & Ancillaries': Car,
//     'IT': Code,
//     'Healthcare': HeartPulse,
//     'Textile': Scissors,
//     'FMCG': ShoppingBag,
//     'Infrastructure': Building2,
//     'Iron & Steel': Hammer,
//     'Abrasives': Hammer,
//     'Agri': Scissors
//   };

//   const formatDecimal = (num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//     return Math.round(num * 100) / 100;
//   };

//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     setIsDark(mediaQuery.matches);

//     const handleChange = (e) => {
//       setIsDark(e.matches);
//     };

//     mediaQuery.addEventListener('change', handleChange);
//     return () => mediaQuery.removeEventListener('change', handleChange);
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const cacheDuration = 60 * 60 * 1000; // 1hr
//     const fetchSectors = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setSectors([]);

//         const cachedData = localStorage.getItem('sectorData');
//         const cacheTimestamp = localStorage.getItem('sectorDataTimestamp');
//         let validSectors = [];

//         if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//           const parsedData = JSON.parse(cachedData);
//           validSectors = parsedData.data
//             .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorMarketCap) && Number.isFinite(sector.SectorCAGR_1Y_MCap) && Array.isArray(sector.Companies?.Symbol))
//             .map((sector, index) => {
//               const peLessThan10Count = sector.Companies.Symbol.filter((_, i) => {
//                 const pe = sector.Companies.PE?.[i];
//                 return pe != null && !isNaN(pe) && pe < 10;
//               }).length;
//               return {
//                 ...sector,
//                 color: colorPalette[index % colorPalette.length],
//                 highlightColor: colorPalette[index % colorPalette.length].replace('0.8)', '1)'),
//                 PELessThan10Count: peLessThan10Count,
//                 TotalCompanies: sector.Companies.Symbol.length
//               };
//             });
//         } else {
//           const response = await axios.get(`${API_BASE}/landpage/sector-summary`, { signal: controller.signal });
//           if (response.data.status !== 'success' || !Array.isArray(response.data.data)) {
//             throw new Error(response.data.message || 'API response is not valid');
//           }
//           validSectors = response.data.data
//             .filter((sector) => sector?.Sector && Number.isFinite(sector.SectorMarketCap) && Number.isFinite(sector.SectorCAGR_1Y_MCap) && Array.isArray(sector.Companies?.Symbol))
//             .map((sector, index) => {
//               const peLessThan10Count = sector.Companies.Symbol.filter((_, i) => {
//                 const pe = sector.Companies.PE?.[i];
//                 return pe != null && !isNaN(pe) && pe < 10;
//               }).length;
//               return {
//                 ...sector,
//                 color: colorPalette[index % colorPalette.length],
//                 highlightColor: colorPalette[index % colorPalette.length].replace('0.8)', '1)'),
//                 PELessThan10Count: peLessThan10Count,
//                 TotalCompanies: sector.Companies.Symbol.length
//               };
//             });
//           localStorage.setItem('sectorData', JSON.stringify(response.data));
//           localStorage.setItem('sectorDataTimestamp', Date.now().toString());
//         }

//         if (validSectors.length === 0) {
//           setSectors([]);
//           setSelectedSector(null);
//           setMaxPELessThan10Sector(null);
//           setMinPELessThan10Sector(null);
//           setLoading(false);
//           return;
//         }

//         const sortedSectors = [...validSectors].sort((a, b) => {
//           return sortOrder === 'desc' ? b.SectorMarketCap - a.SectorMarketCap : a.SectorMarketCap - b.SectorMarketCap;
//         }).slice(0, 10);

//         setSectors(sortedSectors);

//         const maxPELessThan10Sector = validSectors.reduce((max, sector) => {
//           if (!max) return sector;
//           if (sector.PELessThan10Count === max.PELessThan10Count) {
//             return sector.TotalCompanies < max.TotalCompanies ? sector : max;
//           }
//           return sector.PELessThan10Count > max.PELessThan10Count ? sector : max;
//         }, validSectors[0]);

//         const minPELessThan10Sector = validSectors.reduce((min, sector) => {
//           if (!min) return sector;
//           if (sector.PELessThan10Count === min.PELessThan10Count) {
//             return sector.TotalCompanies < min.TotalCompanies ? sector : min;
//           }
//           return sector.PELessThan10Count < min.PELessThan10Count ? sector : min;
//         }, validSectors[0]);

//         setMaxPELessThan10Sector(maxPELessThan10Sector);
//         setMinPELessThan10Sector(minPELessThan10Sector);

//         if (sortedSectors.length > 0) {
//           setSelectedSector(sortedSectors[0]);
//         } else {
//           setSelectedSector(null);
//         }
//         setLoading(false);
//       } catch (error) {
//         if (error.name === 'AbortError') return;
//         setError(error.message || 'Failed to fetch sector data');
//         console.error('Error fetching sector data:', error, error.response?.data);
//         setSectors([]);
//         setSelectedSector(null);
//         setMaxPELessThan10Sector(null);
//         setMinPELessThan10Sector(null);
//         setLoading(false);
//       }
//     };

//     const debounceFetch = setTimeout(() => fetchSectors(), 100);
//     return () => {
//       controller.abort();
//       clearTimeout(debounceFetch);
//     };
//   }, [API_BASE, sortOrder]);

//   const formatNumber = useCallback((num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') {
//       return '₹0';
//     }
//     const absNum = Math.abs(num);
//     const sign = num < 0 ? '-' : '';
//     if (absNum >= 1e7) {
//       const value = absNum / 1e7;
//       return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}cr`;
//     }
//     if (absNum >= 1e5) {
//       const value = absNum / 1e5;
//       return `${sign}₹${value.toLocaleString('en-IN', { minimumFractionDigits: value % 1 === 0 ? 0 : 2 })}L`;
//     }
//     return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//   }, []);

//   const totalMarketCap = useMemo(() => {
//     return sectors.reduce((sum, sector) => sum + (sector.SectorMarketCap || 0), 0);
//   }, [sectors]);

//   const pieChartData = useMemo(() => {
//     if (!Array.isArray(sectors) || sectors.length === 0) {
//       return {
//         labels: ['No Data'],
//         datasets: [{
//           data: [1],
//           backgroundColor: ['rgba(200, 200, 200, 0.5)'],
//           borderWidth: 1,
//           hoverOffset: 0
//         }]
//       };
//     }
//     return {
//       labels: sectors.map(sector => sector.Sector || 'Unknown'),
//       datasets: [{
//         data: sectors.map(sector => sector.SectorMarketCap || 0),
//         backgroundColor: sectors.map((sector, index) => highlightedSector === index ? sector.highlightColor : sector.color),
//         borderWidth: 1,
//         hoverOffset: 20
//       }]
//     };
//   }, [sectors, highlightedSector]);

//   const loaderPieChartData = useMemo(() => ({
//     labels: ['Loading...', 'Loading...', 'Loading...', 'Loading...', 'Loading...'],
//     datasets: [{
//       data: [1, 1, 1, 1, 1],
//       backgroundColor: isDark
//         ? [
//           'rgba(50, 50, 50, 0.5)',
//           'rgba(60, 60, 60, 0.5)',
//           'rgba(70, 70, 70, 0.5)',
//           'rgba(80, 80, 80, 0.5)',
//           'rgba(90, 90, 90, 0.5)'
//         ]
//         : [
//           'rgba(200, 200, 200, 0.5)',
//           'rgba(180, 180, 180, 0.5)',
//           'rgba(160, 160, 160, 0.5)',
//           'rgba(140, 140, 140, 0.5)',
//           'rgba(120, 120, 120, 0.5)'
//         ],
//       borderWidth: 1,
//       borderColor: isDark ? 'rgba(100, 100, 100, 0.5)' : 'rgba(255, 255, 255, 0.5)'
//     }]
//   }), [isDark]);

//   const centerTextPlugin = useMemo(() => ({
//     id: 'centerText',
//     afterDraw(chart) {
//       const { ctx, chartArea: { width, height } } = chart;
//       ctx.save();
//       ctx.font = 'bold 12px Arial';
//       ctx.fillStyle = isDark ? '#756a6aff' : '#ffffff80';
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillText('Market Cap', width / 2, height / 2);
//       ctx.restore();
//     }
//   }), [isDark]);

//   const pieChartOptions = useMemo(() => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: '60%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: {
//           color: isDark ? '#756a6aff' : '#333',
//           font: { size: 10, weight: 'bold' },
//           padding: 8,
//           usePointStyle: true
//         }
//       },
//       tooltip: {
//         enabled: Array.isArray(sectors) && sectors.length > 0,
//         backgroundColor: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
//         titleColor: isDark ? '#777171ff' : '#000000',
//         bodyColor: isDark ? '#8b8585ff' : '#333333',
//         callbacks: {
//           label: function (context) {
//             const label = context.label || '';
//             if (label === 'No Data') return 'No data available';
//             const value = context.raw || 0;
//             const percentage = totalMarketCap > 0 ? ((value / totalMarketCap) * 100).toFixed(1) : 0;
//             return `${label}: ${formatNumber(value)} (${percentage}%)`;
//           }
//         }
//       }
//     },
//     animation: {
//       duration: 1000,
//       easing: 'easeOutQuart'
//     },
//     onClick: (event, elements) => {
//       if (!loading && elements?.length > 0 && Array.isArray(sectors) && sectors.length > 0) {
//         const clickedIndex = elements[0].index;
//         if (clickedIndex < sectors.length) {
//           setSelectedSector(sectors[clickedIndex]);
//           setHighlightedSector(clickedIndex);
//         }
//       }
//     }
//   }), [formatNumber, isDark, loading, sectors, totalMarketCap]);

//   const toggleSortOrder = () => {
//     setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
//   };

//   return (
//     <div className="relative px-4 py-6 flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
//       <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 z-10">
//         <div
//           className="mt-5 w-full text-gray-800 dark:text-gray-100 text-center lg:text-left"
//           initial={{ opacity: 0, y: 20 }}
//           animate={isInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.3 }}
//         >
//           <div className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-start gap-2 text-slate-700 dark:text-indigo-300 text-xs sm:text-sm font-medium">
//             <Sparkles className="w-4 h-4" />
//             <span>Sector Intelligence Platform</span>
//           </div>

//           <h1 className="mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">
//             Capital Market Data <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">Analysis Hub</span>
//           </h1>

//           <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0">
//             <Typewriter
//               words={[
//                 'Warren Buffett - "You do things when opportunities come along"',
//                 'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                 'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                 'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                 'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                 'Charlie Munger - "People calculate too much and think too little"'
//               ]}
//               loop={0}
//               cursor
//               cursorStyle="|"
//               typeSpeed={60}
//               deleteSpeed={30}
//               delaySpeed={1500}
//             />
//           </p>

//           <button
//             onClick={toggleSortOrder}
//             disabled={loading}
//             className={`mt-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-600 text-white rounded-lg text-xs sm:text-sm font-medium transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-sky-700'}`}
//           >
//             Sort by Market Cap: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
//           </button>

//           <AnimatePresence mode="wait">
//             {loading ? (
//               <motion.div
//                 key="loading"
//                 className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="animate-pulse flex flex-col items-center space-y-4">
//                   <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
//                   <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="grid grid-cols-2 gap-3 w-full">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col space-y-1">
//                         <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                         <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ) : !selectedSector || sectors.length === 0 ? (
//               <motion.div
//                 key="no-data"
//                 className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4 text-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm sm:text-base">
//                   No sector data available
//                 </p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors duration-200"
//                 >
//                   Retry
//                 </button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="data"
//                 className="mt-6 flex flex-col gap-4 w-full mx-auto lg:mx-0"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {/* Sector Overview Card */}
//                 <motion.div
//                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4 flex flex-col"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.1, duration: 0.3 }}
//                 >
//                   <div className="flex items-center gap-3 mb-4">
//                     <motion.div
//                       className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
//                       style={{
//                         backgroundColor: selectedSector.highlightColor || selectedSector.color || '#3b82f6',
//                         color: 'white',
//                       }}
//                       whileHover={{ scale: 1.1 }}
//                       transition={{ type: "spring", stiffness: 300, damping: 10 }}
//                     >
//                       {sectorIcons[selectedSector.Sector] ? (
//                         React.createElement(sectorIcons[selectedSector.Sector], {
//                           className: "w-5 h-5",
//                           strokeWidth: 1.5,
//                         })
//                       ) : (
//                         <PieChart className="w-5 h-5" strokeWidth={1.5} />
//                       )}
//                     </motion.div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                         {selectedSector.Sector}
//                       </h3>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         {selectedSector.description || 'Sector performance overview'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-blue-100 dark:border-gray-600">
//                       <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                         <PieChart className="w-4 h-4 opacity-70" />
//                         Market Cap
//                       </div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                         {formatNumber(selectedSector.SectorMarketCap)}
//                       </p>
//                     </div>
//                     <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-green-100 dark:border-gray-600">
//                       <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                         <TrendingUp className="w-4 h-4 opacity-70" />
//                         1Y Growth
//                       </div>
//                       <p
//                         className={`text-sm font-medium ${selectedSector.SectorCAGR_1Y_MCap >= 0
//                           ? 'text-green-600 dark:text-green-400'
//                           : 'text-red-600 dark:text-red-400'
//                           }`}
//                       >
//                         {selectedSector.SectorCAGR_1Y_MCap
//                           ? `${formatDecimal(selectedSector.SectorCAGR_1Y_MCap * 100)}%`
//                           : 'N/A'}
//                       </p>
//                     </div>
//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-100 dark:border-gray-600">
//                       <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                         <BarChart2 className="w-4 h-4 opacity-70" />
//                         PE Ratio
//                       </div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                         {formatDecimal(selectedSector.SectorPE_Mode || 'N/A')}
//                       </p>
//                     </div>
//                   </div>
//                 </motion.div>

//                 {/* Companies with PE < 10 Card */}
//                 <motion.div
//                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-xl mx-auto lg:mx-0 p-4 flex flex-col"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2, duration: 0.3 }}
//                 >
//                   <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
//                     Companies with less than 10 PE ratio
//                   </h4>
//                   <div className="flex flex-col gap-3 flex-1">
//                     {maxPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-sky-200/50 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Highest Count</p>
//                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                               {maxPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-sky-100 dark:bg-sky-900/50 rounded-full text-sky-800 dark:text-sky-100 text-xs font-medium">
//                             {maxPELessThan10Sector.PELessThan10Count}/{maxPELessThan10Sector.TotalCompanies}{' '}
//                             {maxPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <p className="text-xs text-gray-500 dark:text-gray-400 text-center">No data available</p>
//                     )}
//                     {minPELessThan10Sector ? (
//                       <motion.div
//                         className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-3 rounded-lg border border-purple-200/50 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300"
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4, delay: 0.1 }}
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-xs text-gray-500 dark:text-gray-400">Lowest Count</p>
//                             <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                               {minPELessThan10Sector.Sector}
//                             </p>
//                           </div>
//                           <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-purple-800 dark:text-purple-100 text-xs font-medium">
//                             {minPELessThan10Sector.PELessThan10Count}/{minPELessThan10Sector.TotalCompanies}{' '}
//                             {minPELessThan10Sector.PELessThan10Count === 1 ? 'Company' : 'Companies'}
//                           </div>
//                         </div>
//                       </motion.div>
//                     ) : (
//                       <p className="text-xs text-gray-500 dark:text-gray-400 text-center">No data available</p>
//                     )}
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         <div className="w-full mr-20 lg:w-2/5 h-[280px] sm:h-[320px] md:h-[360px] relative mt-4 sm:mt-6" data-tour="home-hero">
//           {error ? (
//             <div className="text-center px-4 py-5 text-gray-500 dark:bg-slate-800 dark:text-gray-300 text-xs sm:text-sm">Could not load sector visualization: {error}</div>
//           ) : (
//             <Pie
//               data={loading ? loaderPieChartData : pieChartData}
//               options={pieChartOptions}
//               plugins={[centerTextPlugin]}
//             />
//           )}
//           <div className="text-center mt-2 text-xs text-gray-600 dark:text-gray-300">
//             <p className="text-sky-600 dark:text-sky-300 font-medium">
//               Showing top 10 sectors by Market Cap ({sortOrder === 'desc' ? 'highest to lowest' : 'lowest to highest'})
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;



// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import {
//   Sparkles, TrendingUp, BarChart2, PieChart, Factory, FlaskConical, DollarSign, Car, Code,
//   HeartPulse, Scissors, ShoppingBag, Building2, Hammer, Wheat, Ship, Briefcase, Battery,
//   Cpu, Droplets, Home, Banknote, Smartphone, Plane, Utensils, Zap, Recycle, Trees, Radio,
//   Globe2, Microscope, Film, Beaker, Wrench, Shield, Truck, Satellite, Package, Server, Coins, BookOpen
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';


// const Banner = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-50px' });
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightedIndustry, setHighlightedIndustry] = useState(null);
//   const [isDark, setIsDark] = useState(false);

//   const industryIcons = {
//     "Pharmaceuticals & Drugs": HeartPulse,
//     "Refineries ": Factory,
//     "Chemicals": FlaskConical,
//     "Finance - NBFC": DollarSign,
//     "Automobiles - Passenger Cars": Car,
//     "IT - Software": Code,
//     "Healthcare": HeartPulse,
//     "Textile": Scissors,
//     "Household & Personal Products": ShoppingBag,
//     "Cement & Construction Materials": Building2,
//     "Auto Ancillary": Hammer,
//     "Electrodes & Welding Equipment": Hammer,
//     "Pesticides & Agrochemicals": Wheat,
//     "Shipping": Ship,
//     "Finance - Investment": Banknote,
//     "Insurance": Shield,
//     "Telecom": Radio,
//     "Media & Entertainment": Film,
//     "Education": BookOpen,
//     "Energy": Zap,
//     "Power Generation & Distribution": Battery,
//     "Diesel Engines": Droplets,
//     "Aviation": Plane,
//     "Hospitality": Utensils,
//     "Real Estate": Home,
//     "Automobile Two & Three Wheelers": Truck,
//     "Defence": Shield,
//     "Mining": Hammer,
//     "Electric Equipment": Cpu,
//     "Electronics": Smartphone,
//     "Environment & Sustainability": Recycle,
//     "Forestry & Paper": Trees,
//     "Research & Development": Microscope,
//     "Global Trade": Globe2,
//     "Logistics": Package,
//     "Engineering - Industrial Equipments": Server,
//     "Finance - Asset Management": Coins,
//     "Construction": Wrench,
//     "Aerospace": Satellite,
//     "Consulting": Briefcase,
//   };

//   const parseDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== 'string') return 0;
//     const cleaned = bracket.replace(/[()[\]]/g, '').replace(/\s+/g, '');
//     const parts = cleaned.split(',').map(Number);
//     if (parts.length < 2) return 0;
//     return (parts[0] + parts[1]) / 2;
//   };

//   const getGreenShade = (intensity) => {
//     if (intensity === 0) return isDark ? "rgb(30,70,50)" : "rgb(212,244,226)";
//     const normalizedIntensity = Math.min(1, Math.max(0, intensity));
//     if (isDark) {
//       const r = Math.round(6 + (100 - 6) * normalizedIntensity);
//       const g = Math.round(95 + (200 - 95) * normalizedIntensity);
//       const b = Math.round(70 + (150 - 70) * normalizedIntensity);
//       return `rgb(${r},${g},${b})`;
//     } else {
//       const r = Math.round(212 - (212 - 6) * normalizedIntensity);
//       const g = Math.round(244 - (244 - 95) * normalizedIntensity);
//       const b = Math.round(226 - (226 - 70) * normalizedIntensity);
//       return `rgb(${r},${g},${b})`;
//     }
//   };

//   const formatDecimal = (num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//     return Math.round(num * 100) / 100;
//   };


//   const formatDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== "string") return "N/A";

//     // Remove any () [] and spaces
//     let cleaned = bracket.replace(/[()[\]]/g, "").replace(/\s+/g, "");

//     // Handle "5+" type (and multiply by 100)
//     if (cleaned.endsWith("+")) {
//       const num = parseFloat(cleaned.replace("+", ""));
//       return isNaN(num) ? "N/A" : `${(num * 100).toFixed(2)}%+`;
//     }

//     // Handle ranges like "0,0.0013" or "0-0.0013"
//     const parts = cleaned.split(/[-,]/).map(n => parseFloat(n)).filter(n => !isNaN(n));

//     if (parts.length === 2) {
//       return `${(parts[0] * 100).toFixed(2)}% - ${(parts[1] * 100).toFixed(2)}%`;
//     }

//     // Single value
//     if (parts.length === 1) {
//       return `${(parts[0] * 100).toFixed(2)}%`;
//     }

//     return "N/A"; // fallback
//   };


//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     setIsDark(mediaQuery.matches);

//     const handleChange = (e) => setIsDark(e.matches);
//     mediaQuery.addEventListener('change', handleChange);
//     return () => mediaQuery.removeEventListener('change', handleChange);
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const cacheDuration = 60 * 60 * 1000; // 1 hour

//     const fetchIndustries = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setIndustries([]);

//         const cachedData = localStorage.getItem('industryDividendData');
//         const cacheTimestamp = localStorage.getItem('industryDividendDataTimestamp');
//         let validIndustries = [];

//         if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//           const parsedData = JSON.parse(cachedData);
//           validIndustries = parsedData.data
//             .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
//             .map((industry) => ({
//               ...industry,
//               bracketAvg: parseDividendBracket(industry.DividendBracket),
//             }));
//         } else {
//           // const response = await axios.get('http://127.0.0.1:8000/industry_dividend_yield', {
//           //   signal: controller.signal,
//           // });
//           const response = await axios.get(`${API_BASE}/landpage/industry-dividend-yield`, { signal: controller.signal });
//           if (response.data.status !== 'success' || !Array.isArray(response.data.data)) {
//             throw new Error(response.data.message || 'API response is not valid');
//           }
//           validIndustries = response.data.data
//             .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
//             .map((industry) => ({
//               ...industry,
//               bracketAvg: parseDividendBracket(industry.DividendBracket),
//             }));
//           localStorage.setItem('industryDividendData', JSON.stringify(response.data));
//           localStorage.setItem('industryDividendDataTimestamp', Date.now().toString());
//         }

//         if (validIndustries.length === 0) {
//           setIndustries([]);
//           setSelectedIndustry(null);
//           setLoading(false);
//           return;
//         }

//         setIndustries(validIndustries.slice(0, 25));
//         if (validIndustries.length > 0) {
//           setSelectedIndustry(validIndustries[0]);
//         } else {
//           setSelectedIndustry(null);
//         }
//         setLoading(false);
//       } catch (error) {
//         if (error.name === 'AbortError') return;
//         setError(error.message || 'Failed to fetch industry data');
//         setIndustries([]);
//         setSelectedIndustry(null);
//         setLoading(false);
//       }
//     };

//     const debounceFetch = setTimeout(() => fetchIndustries(), 100);
//     return () => {
//       controller.abort();
//       clearTimeout(debounceFetch);
//     };
//   }, []);

//   // const formatNumber = useCallback((num) => {
//   //   if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//   //   const absNum = Math.abs(num);
//   //   const sign = num < 0 ? '-' : '';
//   //   if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr`;
//   //   if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: 2 })}L`;
//   //   return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//   // }, []);
//   const formatter = new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   const formatNumber = (num) => {
//     const parsed = Number(num);
//     if (!Number.isFinite(parsed)) return "₹0";

//     const absNum = Math.abs(parsed);
//     const sign = parsed < 0 ? "-" : "";

//     if (absNum >= 1e7) {
//       return `${sign}₹${formatter.format(absNum / 1e7)} cr`;
//     }

//     if (absNum >= 1e5) {
//       return `${sign}₹${formatter.format(absNum / 1e5)} L`;
//     }

//     return `${sign}₹${formatter.format(absNum)}`;
//   };


//   const maxBracketAvg = useMemo(() => {
//     if (industries.length === 0) return 1;
//     const max = Math.max(...industries.map((industry) => industry.bracketAvg || 0));
//     return max > 0 ? max : 1;
//   }, [industries]);

//   const heatmapData = useMemo(() => {
//     if (!Array.isArray(industries) || industries.length === 0) return [];
//     return industries.map((industry, index) => ({
//       ...industry,
//       intensity: industry.bracketAvg / maxBracketAvg,
//       index,
//     }));
//   }, [industries, maxBracketAvg]);





//   return (
//     <div className="mt-5 relative px-4 py-8 sm:py-12 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[80vh] flex items-center justify-center">
//       <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 z-10">
//         {/* Left Section: Title and Selected Industry Card */}
//         <div className="w-full lg:w-1/2 text-gray-800 dark:text-gray-100">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-700 dark:text-indigo-300 text-sm font-medium">
//               <Sparkles className="w-4 h-4" />
//               <span>Analyse Platform</span>
//               <span className="inline-block -rotate-10 bg-white text-sky-600 font-bold text-[15px]  py-0.5 rounded shadow-sm border border-sky-200 dark:bg-slate-800 dark:border-sky-700">
//                 BETA
//               </span>
//             </div>

//             {/* <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
//               <Typewriter
//                 words={[
//                   'Warren Buffett - "You do things when opportunities come along"',
//                   'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                   'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                   'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                   'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                   'Charlie Munger - "People calculate too much and think too little"',
//                 ]}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={60}
//                 deleteSpeed={30}
//                 delaySpeed={1500}
//               />
//             </p> */}
//             <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left min-h-[60px]">
//               <Typewriter
//                 words={[
//                   'Warren Buffett - "You do things when opportunities come along"',
//                   'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                   'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                   'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                   'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                   'Charlie Munger - "People calculate too much and think too little"',
//                 ]}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={60}
//                 deleteSpeed={30}
//                 delaySpeed={1500}
//               />
//             </p>
//           </motion.div>

//           <AnimatePresence mode="wait">
//             {loading ? (
//               <motion.div
//                 key="loading"
//                 className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="animate-pulse flex flex-col items-center space-y-4">
//                   <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
//                   <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="grid grid-cols-2 gap-3 w-full">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col space-y-1">
//                         <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                         <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ) : !selectedIndustry || industries.length === 0 ? (
//               <motion.div
//                 key="no-data"
//                 className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6 text-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
//                   No industry data available
//                 </p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors duration-200"
//                 >
//                   Retry
//                 </button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="data"
//                 className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex items-center gap-4 mb-4">
//                   <motion.div
//                     className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
//                     style={{
//                       backgroundColor: getGreenShade(selectedIndustry.intensity || 0),
//                       color: 'black',
//                     }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: 'spring', stiffness: 300, damping: 10 }}
//                   >
//                     {industryIcons[selectedIndustry.industry] ? (
//                       React.createElement(industryIcons[selectedIndustry.industry], {
//                         className: 'w-6 h-6',
//                         strokeWidth: 1.5,
//                       })
//                     ) : (
//                       <PieChart className="w-6 h-6" strokeWidth={1.5} />
//                     )}
//                   </motion.div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.industry}
//                     </h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Industry dividend overview
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Modal Range
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.DividendBracket}
//                     </p>
//                   </div> */}
//                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Modal Range
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {formatDividendBracket(selectedIndustry.DividendBracket)}
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-green-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <PieChart className="w-4 h-4 opacity-70" />
//                       Industry Dividend Yield
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {(selectedIndustry.AvgDividendYield * 100).toFixed(2)}%
//                     </p>
//                   </div>
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <TrendingUp className="w-4 h-4 opacity-70" />
//                       Range Frequency
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.CountInBracket}
//                     </p>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Company Count
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.CompanyCount}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Right Section: Heatmap */}
//         <div className="mt-10 w-full lg:w-1/2 mt-8 lg:mt-0" data-tour="home-hero">
//           {error ? (
//             <div className="text-center px-4 py-6 text-gray-600 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
//               Could not load industry visualization: {error}
//             </div>
//           ) : loading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 animate-pulse">
//               {[...Array(25)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="rounded-md h-24"
//                   style={{ backgroundColor: getGreenShade(0.5) }}
//                 ></div>
//               ))}
//             </div>
//           ) : heatmapData.length === 0 ? (
//             <div className="text-center px-4 py-6 text-gray-500 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
//               No industry data available
//             </div>
//           ) : (
//             <div className="relative w-full">
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
//                 {heatmapData.slice(0, 25).map((industry, index) => (
//                   <motion.div
//                     key={industry.industry}
//                     className="relative rounded-md cursor-pointer flex items-center justify-center p-3 bg-opacity-90 shadow-sm hover:shadow-md transition-shadow duration-200"
//                     style={{
//                       backgroundColor: getGreenShade(industry.intensity),
//                     }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: 'spring', stiffness: 250, damping: 14 }}
//                     onClick={() => setSelectedIndustry(industry)}
//                     onMouseEnter={() => setHighlightedIndustry(index)}
//                     onMouseLeave={() => setHighlightedIndustry(null)}
//                   >
//                     {/* <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color: isDark ? '#e5e7eb' : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={isDark ? '#e5e7eb' : '#757b86ff'}
//                         />
//                       )}
//                       <p className={`text-xs font-medium text-wrap truncate w-full ${isDark ? '#e5e7eb' : '#374151'}`}>
//                         {industry.industry}
//                       </p>
//                       <p className={`text-xs ${isDark ? '#e5e7eb' : '#374151'}`}>
//                         {industry.DividendBracket}
//                       </p>
//                     </div> */}

//                     {/* <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color:
//                             industry.bgColor === '#064e3b' // dark green background
//                               ? '#ffffff' // white icon
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={
//                             industry.bgColor === '#064e3b'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#757b86'
//                           }
//                         />
//                       )}

//                       {/* Industry Name 
//                       <p
//                         className="text-xs font-bold font-medium text-wrap truncate w-full"
//                         style={{
//                           color:
//                             industry.bgColor === '#064e3b'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#1a9ee0ff',
//                           WebkitTextStroke:
//                             industry.bgColor === '#064e3b'
//                               ? '0.5px #000000' // thin black outline for readability
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.industry}
//                       </p>

//                       {/* Dividend Bracket 
//                       <p
//                         className="text-xs"
//                         style={{
//                           color:
//                             industry.bgColor === '#064e3b'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#b0b1b3ff'
//                                 : '#1a9ee0ff',
//                           WebkitTextStroke:
//                             industry.bgColor === '#064e3b'
//                               ? '0.5px #d3cacaff'
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.DividendBracket}
//                       </p>
//                     </div> */}

//                     <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color:
//                             industry.bgColor === '#065f46' // dark green background
//                               ? '#ffffff' // white icon
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#020202ff'
//                           }
//                         />
//                       )}

//                       {/* Industry Name */}
//                       <p
//                         className="text-xs font-bold font-medium text-wrap truncate w-full"
//                         style={{
//                           color:
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#000000ef',
//                           WebkitTextStroke:
//                             industry.bgColor === '#065f46'
//                               ? '0.5px #fde6e6ff' // thin black outline for readability
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.industry}
//                       </p>

//                       {/* Dividend Bracket */}
//                       <p
//                         className="text-xs"
//                         style={{
//                           color:
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#ffffffff'
//                                 : '#000000ff',
//                           WebkitTextStroke:
//                             industry.bgColor === '#065f46'
//                               ? '0.5px #d3cacaff'
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.DividendBracket}
//                       </p>
//                     </div>


//                     {highlightedIndustry === index && (
//                       <div className="absolute z-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md text-xs -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
//                         <p className="font-semibold text-gray-900 dark:text-gray-100">{industry.industry}</p>
//                         <p className="text-gray-600 dark:text-gray-300">
//                           Dividend Bracket Avg: {(industry.bracketAvg * 100).toFixed(2)}%
//                         </p>
//                       </div>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//               {/* <div className="mt-6 flex flex-col items-center">
//                 <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
//                   Dividend Bracket Average Heatmap (Top 25 Industries)
//                 </p>
//                 <div className="w-full max-w-xs flex items-center gap-2">
//                   <span className="text-xs text-gray-600 dark:text-gray-300">0.00%</span>
//                   <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 via-green-400 to-green-900"></div>
//                   <span className="text-xs text-gray-600 dark:text-gray-300">
//                     {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
//                   </span>
//                 </div>
//               </div> */}
//               <div className="mt-6 flex flex-col items-center">
//                 <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
//                   Dividend Bracket Average Heatmap (Top 25 Industries)
//                 </p>
//                 <div className="w-full max-w-md flex items-center gap-2">
//                   <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">0.00%</span>
//                   {/* <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 to-green-900"></div> */}
//                   <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 to-green-900 dark:from-green-900 dark:to-green-100"></div>
//                   <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
//                     {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;


// -------------old-------------------

// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import {
//   Sparkles, TrendingUp, BarChart2, PieChart, Factory, FlaskConical, DollarSign, Car, Code,
//   HeartPulse, Scissors, ShoppingBag, Building2, Hammer, Wheat, Ship, Briefcase, Battery,
//   Cpu, Droplets, Home, Banknote, Smartphone, Plane, Utensils, Zap, Recycle, Trees, Radio,
//   Globe2, Microscope, Film, Beaker, Wrench, Shield, Truck, Satellite, Package, Server, Coins, BookOpen
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';


// const Banner = () => {
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-50px' });
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightedIndustry, setHighlightedIndustry] = useState(null);
//   const [isDark, setIsDark] = useState(false);

//   const industryIcons = {
//     "Pharmaceuticals & Drugs": HeartPulse,
//     "Refineries ": Factory,
//     "Chemicals": FlaskConical,
//     "Finance - NBFC": DollarSign,
//     "Automobiles - Passenger Cars": Car,
//     "IT - Software": Code,
//     "Healthcare": HeartPulse,
//     "Textile": Scissors,
//     "Household & Personal Products": ShoppingBag,
//     "Cement & Construction Materials": Building2,
//     "Auto Ancillary": Hammer,
//     "Electrodes & Welding Equipment": Hammer,
//     "Pesticides & Agrochemicals": Wheat,
//     "Shipping": Ship,
//     "Finance - Investment": Banknote,
//     "Insurance": Shield,
//     "Telecom": Radio,
//     "Media & Entertainment": Film,
//     "Education": BookOpen,
//     "Energy": Zap,
//     "Power Generation & Distribution": Battery,
//     "Diesel Engines": Droplets,
//     "Aviation": Plane,
//     "Hospitality": Utensils,
//     "Real Estate": Home,
//     "Automobile Two & Three Wheelers": Truck,
//     "Defence": Shield,
//     "Mining": Hammer,
//     "Electric Equipment": Cpu,
//     "Electronics": Smartphone,
//     "Environment & Sustainability": Recycle,
//     "Forestry & Paper": Trees,
//     "Research & Development": Microscope,
//     "Global Trade": Globe2,
//     "Logistics": Package,
//     "Engineering - Industrial Equipments": Server,
//     "Finance - Asset Management": Coins,
//     "Construction": Wrench,
//     "Aerospace": Satellite,
//     "Consulting": Briefcase,
//   };

//   const parseDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== 'string') return 0;
//     const cleaned = bracket.replace(/[()[\]]/g, '').replace(/\s+/g, '');
//     const parts = cleaned.split(',').map(Number);
//     if (parts.length < 2) return 0;
//     return (parts[0] + parts[1]) / 2;
//   };

//   const getGreenShade = (intensity) => {
//     if (intensity === 0) return isDark ? "rgb(30,70,50)" : "rgb(212,244,226)";
//     const normalizedIntensity = Math.min(1, Math.max(0, intensity));
//     if (isDark) {
//       const r = Math.round(6 + (100 - 6) * normalizedIntensity);
//       const g = Math.round(95 + (200 - 95) * normalizedIntensity);
//       const b = Math.round(70 + (150 - 70) * normalizedIntensity);
//       return `rgb(${r},${g},${b})`;
//     } else {
//       const r = Math.round(212 - (212 - 6) * normalizedIntensity);
//       const g = Math.round(244 - (244 - 95) * normalizedIntensity);
//       const b = Math.round(226 - (226 - 70) * normalizedIntensity);
//       return `rgb(${r},${g},${b})`;
//     }
//   };

//   const formatDecimal = (num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//     return Math.round(num * 100) / 100;
//   };


//   const formatDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== "string") return "N/A";

//     // Remove any () [] and spaces
//     let cleaned = bracket.replace(/[()[\]]/g, "").replace(/\s+/g, "");

//     // Handle "5+" type (and multiply by 100)
//     if (cleaned.endsWith("+")) {
//       const num = parseFloat(cleaned.replace("+", ""));
//       return isNaN(num) ? "N/A" : `${(num * 100).toFixed(2)}%+`;
//     }

//     // Handle ranges like "0,0.0013" or "0-0.0013"
//     const parts = cleaned.split(/[-,]/).map(n => parseFloat(n)).filter(n => !isNaN(n));

//     if (parts.length === 2) {
//       return `${(parts[0] * 100).toFixed(2)}% - ${(parts[1] * 100).toFixed(2)}%`;
//     }

//     // Single value
//     if (parts.length === 1) {
//       return `${(parts[0] * 100).toFixed(2)}%`;
//     }

//     return "N/A"; // fallback
//   };


//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     setIsDark(mediaQuery.matches);

//     const handleChange = (e) => setIsDark(e.matches);
//     mediaQuery.addEventListener('change', handleChange);
//     return () => mediaQuery.removeEventListener('change', handleChange);
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const cacheDuration = 60 * 60 * 1000; // 1 hour

//     const fetchIndustries = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setIndustries([]);

//         const cachedData = localStorage.getItem('industryDividendData');
//         const cacheTimestamp = localStorage.getItem('industryDividendDataTimestamp');
//         let validIndustries = [];

//         if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//           const parsedData = JSON.parse(cachedData);
//           validIndustries = parsedData.data
//             .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
//             .map((industry) => ({
//               ...industry,
//               bracketAvg: parseDividendBracket(industry.DividendBracket),
//             }));
//         } else {
//           // const response = await axios.get('http://127.0.0.1:8000/industry_dividend_yield', {
//           //   signal: controller.signal,
//           // });
//           const response = await axios.get(`${API_BASE}/landpage/industry-dividend-yield`, { signal: controller.signal });
//           if (response.data.status !== 'success' || !Array.isArray(response.data.data)) {
//             throw new Error(response.data.message || 'API response is not valid');
//           }
//           validIndustries = response.data.data
//             .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
//             .map((industry) => ({
//               ...industry,
//               bracketAvg: parseDividendBracket(industry.DividendBracket),
//             }));
//           localStorage.setItem('industryDividendData', JSON.stringify(response.data));
//           localStorage.setItem('industryDividendDataTimestamp', Date.now().toString());
//         }

//         if (validIndustries.length === 0) {
//           setIndustries([]);
//           setSelectedIndustry(null);
//           setLoading(false);
//           return;
//         }

//         setIndustries(validIndustries.slice(0, 25));
//         if (validIndustries.length > 0) {
//           setSelectedIndustry(validIndustries[0]);
//         } else {
//           setSelectedIndustry(null);
//         }
//         setLoading(false);
//       } catch (error) {
//         if (error.name === 'AbortError') return;
//         setError(error.message || 'Failed to fetch industry data');
//         setIndustries([]);
//         setSelectedIndustry(null);
//         setLoading(false);
//       }
//     };

//     const debounceFetch = setTimeout(() => fetchIndustries(), 100);
//     return () => {
//       controller.abort();
//       clearTimeout(debounceFetch);
//     };
//   }, []);

//   // const formatNumber = useCallback((num) => {
//   //   if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//   //   const absNum = Math.abs(num);
//   //   const sign = num < 0 ? '-' : '';
//   //   if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr`;
//   //   if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: 2 })}L`;
//   //   return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//   // }, []);
//   const formatter = new Intl.NumberFormat("en-IN", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

//   const formatNumber = (num) => {
//     const parsed = Number(num);
//     if (!Number.isFinite(parsed)) return "₹0";

//     const absNum = Math.abs(parsed);
//     const sign = parsed < 0 ? "-" : "";

//     if (absNum >= 1e7) {
//       return `${sign}₹${formatter.format(absNum / 1e7)} cr`;
//     }

//     if (absNum >= 1e5) {
//       return `${sign}₹${formatter.format(absNum / 1e5)} L`;
//     }

//     return `${sign}₹${formatter.format(absNum)}`;
//   };


//   const maxBracketAvg = useMemo(() => {
//     if (industries.length === 0) return 1;
//     const max = Math.max(...industries.map((industry) => industry.bracketAvg || 0));
//     return max > 0 ? max : 1;
//   }, [industries]);

//   const heatmapData = useMemo(() => {
//     if (!Array.isArray(industries) || industries.length === 0) return [];
//     return industries.map((industry, index) => ({
//       ...industry,
//       intensity: industry.bracketAvg / maxBracketAvg,
//       index,
//     }));
//   }, [industries, maxBracketAvg]);





//   return (
//     <div className="relative px-4 py-8 sm:py-12 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[80vh] flex items-center justify-center">
//       <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 z-10">
//         {/* Left Section: Title and Selected Industry Card */}
//         <div className="mt-10 w-full lg:w-1/2 text-gray-800 dark:text-gray-100">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-700 dark:text-indigo-300 text-sm font-medium">
//               <Sparkles className="w-4 h-4" />
//               <span>Analyse Platform</span>
//               <span className="inline-block -rotate-10 bg-white text-sky-600 font-bold text-[15px]  py-0.5 rounded shadow-sm border border-sky-200 dark:bg-slate-800 dark:border-sky-700">
//                 BETA
//               </span>

//             </div>
//             <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-center lg:text-left">
//               Capital Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">Data Analytics</span>
//             </h1>
//             {/* <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
//               <Typewriter
//                 words={[
//                   'Warren Buffett - "You do things when opportunities come along"',
//                   'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                   'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                   'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                   'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                   'Charlie Munger - "People calculate too much and think too little"',
//                 ]}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={60}
//                 deleteSpeed={30}
//                 delaySpeed={1500}
//               />
//             </p> */}
//             <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left min-h-[60px]">
//               <Typewriter
//                 words={[
//                   'Warren Buffett - "You do things when opportunities come along"',
//                   'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                   'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                   'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                   'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                   'Charlie Munger - "People calculate too much and think too little"',
//                 ]}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={60}
//                 deleteSpeed={30}
//                 delaySpeed={1500}
//               />
//             </p>
//           </motion.div>

//           <AnimatePresence mode="wait">
//             {loading ? (
//               <motion.div
//                 key="loading"
//                 className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="animate-pulse flex flex-col items-center space-y-4">
//                   <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
//                   <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="grid grid-cols-2 gap-3 w-full">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col space-y-1">
//                         <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                         <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ) : !selectedIndustry || industries.length === 0 ? (
//               <motion.div
//                 key="no-data"
//                 className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6 text-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
//                   No industry data available
//                 </p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors duration-200"
//                 >
//                   Retry
//                 </button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="data"
//                 className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex items-center gap-4 mb-4">
//                   <motion.div
//                     className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
//                     style={{
//                       backgroundColor: getGreenShade(selectedIndustry.intensity || 0),
//                       color: 'black',
//                     }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: 'spring', stiffness: 300, damping: 10 }}
//                   >
//                     {industryIcons[selectedIndustry.industry] ? (
//                       React.createElement(industryIcons[selectedIndustry.industry], {
//                         className: 'w-6 h-6',
//                         strokeWidth: 1.5,
//                       })
//                     ) : (
//                       <PieChart className="w-6 h-6" strokeWidth={1.5} />
//                     )}
//                   </motion.div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.industry}
//                     </h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Industry dividend overview
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Modal Range
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.DividendBracket}
//                     </p>
//                   </div> */}
//                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Dividend Range
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {formatDividendBracket(selectedIndustry.DividendBracket)}
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-green-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <PieChart className="w-4 h-4 opacity-70" />
//                       Industry Dividend Yield
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {(selectedIndustry.AvgDividendYield * 100).toFixed(2)}%
//                     </p>
//                   </div>
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <TrendingUp className="w-4 h-4 opacity-70" />
//                       Range Frequency
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.CountInBracket}
//                     </p>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Company Count
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.CompanyCount}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Right Section: Heatmap */}
//         <div className="mt-20 w-full lg:w-1/2 mt-8 lg:mt-0" data-tour="home-hero">
//           {error ? (
//             <div className="text-center px-4 py-6 text-gray-600 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
//               Could not load industry visualization: {error}
//             </div>
//           ) : loading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 animate-pulse">
//               {[...Array(25)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="rounded-md h-24"
//                   style={{ backgroundColor: getGreenShade(0.5) }}
//                 ></div>
//               ))}
//             </div>
//           ) : heatmapData.length === 0 ? (
//             <div className="text-center px-4 py-6 text-gray-500 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
//               No industry data available
//             </div>
//           ) : (
//             <div className="relative w-full">
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
//                 {heatmapData.slice(0, 25).map((industry, index) => (
//                   <motion.div
//                     key={industry.industry}
//                     className="relative rounded-md cursor-pointer flex items-center justify-center p-3 bg-opacity-90 shadow-sm hover:shadow-md transition-shadow duration-200"
//                     style={{
//                       backgroundColor: getGreenShade(industry.intensity),
//                     }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: 'spring', stiffness: 250, damping: 14 }}
//                     onClick={() => setSelectedIndustry(industry)}
//                     onMouseEnter={() => setHighlightedIndustry(index)}
//                     onMouseLeave={() => setHighlightedIndustry(null)}
//                   >
//                     {/* <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color: isDark ? '#e5e7eb' : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={isDark ? '#e5e7eb' : '#757b86ff'}
//                         />
//                       )}
//                       <p className={`text-xs font-medium text-wrap truncate w-full ${isDark ? '#e5e7eb' : '#374151'}`}>
//                         {industry.industry}
//                       </p>
//                       <p className={`text-xs ${isDark ? '#e5e7eb' : '#374151'}`}>
//                         {industry.DividendBracket}
//                       </p>
//                     </div> */}

//                     {/* <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color:
//                             industry.bgColor === '#064e3b' // dark green background
//                               ? '#ffffff' // white icon
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={
//                             industry.bgColor === '#064e3b'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#757b86'
//                           }
//                         />
//                       )}

//                       {/* Industry Name 
//                       <p
//                         className="text-xs font-bold font-medium text-wrap truncate w-full"
//                         style={{
//                           color:
//                             industry.bgColor === '#064e3b'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#1a9ee0ff',
//                           WebkitTextStroke:
//                             industry.bgColor === '#064e3b'
//                               ? '0.5px #000000' // thin black outline for readability
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.industry}
//                       </p>

//                       {/* Dividend Bracket 
//                       <p
//                         className="text-xs"
//                         style={{
//                           color:
//                             industry.bgColor === '#064e3b'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#b0b1b3ff'
//                                 : '#1a9ee0ff',
//                           WebkitTextStroke:
//                             industry.bgColor === '#064e3b'
//                               ? '0.5px #d3cacaff'
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.DividendBracket}
//                       </p>
//                     </div> */}

//                     <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color:
//                             industry.bgColor === '#065f46' // dark green background
//                               ? '#ffffff' // white icon
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#020202ff'
//                           }
//                         />
//                       )}

//                       {/* Industry Name */}
//                       <p
//                         className="text-xs font-bold font-medium text-wrap truncate w-full"
//                         style={{
//                           color:
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#000000ef',
//                           WebkitTextStroke:
//                             industry.bgColor === '#065f46'
//                               ? '0.5px #fde6e6ff' // thin black outline for readability
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.industry}
//                       </p>

//                       {/* Dividend Bracket */}
//                       <p
//                         className="text-xs"
//                         style={{
//                           color:
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#ffffffff'
//                                 : '#000000ff',
//                           WebkitTextStroke:
//                             industry.bgColor === '#065f46'
//                               ? '0.5px #d3cacaff'
//                               : '0px transparent',
//                         }}
//                       >
//                         {formatDividendBracket(industry.DividendBracket)}
//                       </p>
//                     </div>


//                     {highlightedIndustry === index && (
//                       <div className="absolute z-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md text-xs -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
//                         <p className="font-semibold text-gray-900 dark:text-gray-100">{industry.industry}</p>
//                         <p className="text-gray-600 dark:text-gray-300">
//                           Dividend Bracket Avg: {(industry.bracketAvg * 100).toFixed(2)}%
//                         </p>
//                       </div>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//               {/* <div className="mt-6 flex flex-col items-center">
//                 <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
//                   Dividend Bracket Average Heatmap (Top 25 Industries)
//                 </p>
//                 <div className="w-full max-w-xs flex items-center gap-2">
//                   <span className="text-xs text-gray-600 dark:text-gray-300">0.00%</span>
//                   <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 via-green-400 to-green-900"></div>
//                   <span className="text-xs text-gray-600 dark:text-gray-300">
//                     {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
//                   </span>
//                 </div>
//               </div> */}
//               <div className="mt-6 flex flex-col items-center">
//                 <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
//                   Dividend Bracket Average Heatmap (Top 25 Industries)
//                 </p>
//                 <div className="w-full max-w-md flex items-center gap-2">
//                   <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">0.00%</span>
//                   <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 to-green-900"></div>
//                   <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
//                     {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;

// =================19====================

// import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// import { motion, useInView, AnimatePresence } from 'framer-motion';
// import {
//   Sparkles, TrendingUp, BarChart2, PieChart, Factory, FlaskConical, DollarSign, Car, Code,
//   HeartPulse, Scissors, ShoppingBag, Building2, Hammer, Wheat, Ship, Briefcase, Battery,
//   Cpu, Droplets, Home, Banknote, Smartphone, Plane, Utensils, Zap, Recycle, Trees, Radio,
//   Globe2, Microscope, Film, Beaker, Wrench, Shield, Truck, Satellite, Package, Server, Coins, BookOpen
// } from 'lucide-react';
// import { Typewriter } from 'react-simple-typewriter';
// import axios from 'axios';


// const Banner = () => {
//   const ref = useRef(null);
//   const isInView = useInView(ref, { once: true, margin: '-50px' });
//   const [industries, setIndustries] = useState([]);
//   const [selectedIndustry, setSelectedIndustry] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [highlightedIndustry, setHighlightedIndustry] = useState(null);
//   const [isDark, setIsDark] = useState(false);
//   const [selectedView, setSelectedView] = useState('');
//   const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;
//   const handleViewChange = (event) => {
//     setSelectedView(event.target.value);
//   };

//   const industryIcons = {
//     "Pharmaceuticals & Drugs": HeartPulse,
//     "Refineries ": Factory,
//     "Chemicals": FlaskConical,
//     "Finance - NBFC": DollarSign,
//     "Automobiles - Passenger Cars": Car,
//     "IT - Software": Code,
//     "Healthcare": HeartPulse,
//     "Textile": Scissors,
//     "Household & Personal Products": ShoppingBag,
//     "Cement & Construction Materials": Building2,
//     "Auto Ancillary": Hammer,
//     "Electrodes & Welding Equipment": Hammer,
//     "Pesticides & Agrochemicals": Wheat,
//     "Shipping": Ship,
//     "Finance - Investment": Banknote,
//     "Insurance": Shield,
//     "Telecom": Radio,
//     "Media & Entertainment": Film,
//     "Education": BookOpen,
//     "Energy": Zap,
//     "Power Generation & Distribution": Battery,
//     "Diesel Engines": Droplets,
//     "Aviation": Plane,
//     "Hospitality": Utensils,
//     "Real Estate": Home,
//     "Automobile Two & Three Wheelers": Truck,
//     "Defence": Shield,
//     "Mining": Hammer,
//     "Electric Equipment": Cpu,
//     "Electronics": Smartphone,
//     "Environment & Sustainability": Recycle,
//     "Forestry & Paper": Trees,
//     "Research & Development": Microscope,
//     "Global Trade": Globe2,
//     "Logistics": Package,
//     "Engineering - Industrial Equipments": Server,
//     "Finance - Asset Management": Coins,
//     "Construction": Wrench,
//     "Aerospace": Satellite,
//     "Consulting": Briefcase,
//   };

//   const parseDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== 'string') return 0;
//     const cleaned = bracket.replace(/[()[\]]/g, '').replace(/\s+/g, '');
//     const parts = cleaned.split(',').map(Number);
//     if (parts.length < 2) return 0;
//     return (parts[0] + parts[1]) / 2;
//   };

//   const getGreenShade = (intensity) => {
//     if (intensity === 0) return isDark ? "rgb(30,70,50)" : "rgb(212,244,226)";
//     const normalizedIntensity = Math.min(1, Math.max(0, intensity));
//     if (isDark) {
//       const r = Math.round(6 + (100 - 6) * normalizedIntensity);
//       const g = Math.round(95 + (200 - 95) * normalizedIntensity);
//       const b = Math.round(70 + (150 - 70) * normalizedIntensity);
//       return `rgb(${r},${g},${b})`;
//     } else {
//       const r = Math.round(212 - (212 - 6) * normalizedIntensity);
//       const g = Math.round(244 - (244 - 95) * normalizedIntensity);
//       const b = Math.round(226 - (226 - 70) * normalizedIntensity);
//       return `rgb(${r},${g},${b})`;
//     }
//   };

//   const formatDecimal = (num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return 'N/A';
//     return Math.round(num * 100) / 100;
//   };


//   const formatDividendBracket = (bracket) => {
//     if (!bracket || typeof bracket !== "string") return "N/A";

//     // Remove any () [] and spaces
//     let cleaned = bracket.replace(/[()[\]]/g, "").replace(/\s+/g, "");

//     // Handle "5+" type (and multiply by 100)
//     if (cleaned.endsWith("+")) {
//       const num = parseFloat(cleaned.replace("+", ""));
//       return isNaN(num) ? "N/A" : `${(num * 100).toFixed(2)}%+`;
//     }

//     // Handle ranges like "0,0.0013" or "0-0.0013"
//     const parts = cleaned.split(/[-,]/).map(n => parseFloat(n)).filter(n => !isNaN(n));

//     if (parts.length === 2) {
//       return `${(parts[0] * 100).toFixed(2)}% - ${(parts[1] * 100).toFixed(2)}%`;
//     }

//     // Single value
//     if (parts.length === 1) {
//       return `${(parts[0] * 100).toFixed(2)}%`;
//     }

//     return "N/A"; // fallback
//   };


//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
//     setIsDark(mediaQuery.matches);

//     const handleChange = (e) => setIsDark(e.matches);
//     mediaQuery.addEventListener('change', handleChange);
//     return () => mediaQuery.removeEventListener('change', handleChange);
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const cacheDuration = 60 * 60 * 1000; // 1 hour

//     const fetchIndustries = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         setIndustries([]);

//         const cachedData = localStorage.getItem('industryDividendData');
//         const cacheTimestamp = localStorage.getItem('industryDividendDataTimestamp');
//         let validIndustries = [];

//         if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
//           const parsedData = JSON.parse(cachedData);
//           validIndustries = parsedData.data
//             .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
//             .map((industry) => ({
//               ...industry,
//               bracketAvg: parseDividendBracket(industry.DividendBracket),
//             }));
//         } else {
//           //   const response = await axios.get('http://127.0.0.1:8000/industry_dividend_yield', {
//           //     signal: controller.signal,
//           //   });
//           const response = await axios.get(`${API_BASE}/landpage/industry-dividend-yield`, { signal: controller.signal });
//           if (response.data.status !== 'success' || !Array.isArray(response.data.data)) {
//             throw new Error(response.data.message || 'API response is not valid');
//           }
//           validIndustries = response.data.data
//             .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
//             .map((industry) => ({
//               ...industry,
//               bracketAvg: parseDividendBracket(industry.DividendBracket),
//             }));
//           localStorage.setItem('industryDividendData', JSON.stringify(response.data));
//           localStorage.setItem('industryDividendDataTimestamp', Date.now().toString());
//         }

//         if (validIndustries.length === 0) {
//           setIndustries([]);
//           setSelectedIndustry(null);
//           setLoading(false);
//           return;
//         }

//         setIndustries(validIndustries.slice(0, 25));
//         if (validIndustries.length > 0) {
//           setSelectedIndustry(validIndustries[0]);
//         } else {
//           setSelectedIndustry(null);
//         }
//         setLoading(false);
//       } catch (error) {
//         if (error.name === 'AbortError') return;
//         setError(error.message || 'Failed to fetch industry data');
//         setIndustries([]);
//         setSelectedIndustry(null);
//         setLoading(false);
//       }
//     };

//     const debounceFetch = setTimeout(() => fetchIndustries(), 100);
//     return () => {
//       controller.abort();
//       clearTimeout(debounceFetch);
//     };
//   }, []);

//   const formatNumber = useCallback((num) => {
//     if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
//     const absNum = Math.abs(num);
//     const sign = num < 0 ? '-' : '';
//     if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr`;
//     if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: 2 })}L`;
//     return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
//   }, []);

//   const maxBracketAvg = useMemo(() => {
//     if (industries.length === 0) return 1;
//     const max = Math.max(...industries.map((industry) => industry.bracketAvg || 0));
//     return max > 0 ? max : 1;
//   }, [industries]);

//   const heatmapData = useMemo(() => {
//     if (!Array.isArray(industries) || industries.length === 0) return [];
//     return industries.map((industry, index) => ({
//       ...industry,
//       intensity: industry.bracketAvg / maxBracketAvg,
//       index,
//     }));
//   }, [industries, maxBracketAvg]);





//   return (
//     <div className=" relative px-3 py-6 sm:py-12 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-[80vh] flex items-center justify-center">

//       <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 z-10">
//         {/* Left Section: Title and Selected Industry Card */}
//         <div className="w-full lg:w-1/2 text-gray-800 dark:text-gray-100">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={isInView ? { opacity: 1, y: 0 } : {}}
//             transition={{ duration: 0.5 }}
//           >
//             <div className="flex items-center justify-center lg:justify-start  text-slate-700 dark:text-indigo-300 text-sm font-medium">
//               <Sparkles className="w-4 h-4" />
//               <span>Analyse Platform</span>

//             </div>
//             <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-center lg:text-left">
//               Capital Market{" "}
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">
//                 Data Analytics
//               </span>
//               <span className="z-10 align-right inline-block -rotate-6 bg-white text-sky-600 dark:bg-slate-800 font-semibold text-xs px-2 py-0.5 rounded-md border border-sky-300 dark:border-sky-600 shadow-sm">
//                 BETA
//               </span>
//             </h1>


//             {/* <p className="mt-5 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
//               <Typewriter
//                 words={[
//                   'Warren Buffett - "You do things when opportunities come along"',
//                   'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                   'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                   'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                   'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',
//                   'Charlie Munger - "People calculate too much and think too little"',
//                 ]}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={60}
//                 deleteSpeed={30}
//                 delaySpeed={1500}
//               />
//             </p> */}

//             <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left min-h-[60px]">
//               <Typewriter
//                 words={[
//                   'Ratan Tata - "I do not believe in taking right decisions, I take decisions and then make them RIGHT."',
//                   // 'Warren Buffett - "You do things when opportunities come along"',
//                   'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
//                   'Charlie Munger - "People calculate too much and think too little"',
//                   // 'Warren Buffett - "Best Chance to deploy capital are when things are down"',
//                   'Mentor - "Value of money is not determined by what can it be exchanged for, rather by how it can be used to protect against uncertainties"',
//                   'Charlie Munger - "Big money is not in buying and selling, its in waiting when to buy and when to sell"',

//                 ]}
//                 loop={0}
//                 cursor
//                 cursorStyle="|"
//                 typeSpeed={60}
//                 deleteSpeed={30}
//                 delaySpeed={1500}
//               />
//             </p>

//           </motion.div>

//           <AnimatePresence mode="wait">
//             {loading ? (
//               <motion.div
//                 key="loading"
//                 className="mt-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="animate-pulse flex flex-col items-center space-y-4">
//                   <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
//                   <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
//                   <div className="grid grid-cols-2 gap-3 w-full">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col space-y-1">
//                         <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                         <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </motion.div>
//             ) : !selectedIndustry || industries.length === 0 ? (
//               <motion.div
//                 key="no-data"
//                 className="mt-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6 text-center"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
//                   No industry data available
//                 </p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors duration-200"
//                 >
//                   Retry
//                 </button>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="data"
//                 className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <div className="flex items-center gap-4 mb-4">
//                   <motion.div
//                     className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md"
//                     style={{
//                       backgroundColor: getGreenShade(selectedIndustry.intensity || 0),
//                       color: 'black',
//                     }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: 'spring', stiffness: 300, damping: 10 }}
//                   >
//                     {industryIcons[selectedIndustry.industry] ? (
//                       React.createElement(industryIcons[selectedIndustry.industry], {
//                         className: 'w-6 h-6',
//                         strokeWidth: 1.5,
//                       })
//                     ) : (
//                       <PieChart className="w-6 h-6" strokeWidth={1.5} />
//                     )}
//                   </motion.div>
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.industry}
//                     </h3>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                       Industry dividend overview
//                     </p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   {/* <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Modal Range
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.DividendBracket}
//                     </p>
//                   </div> */}
//                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Dividend Range
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {formatDividendBracket(selectedIndustry.DividendBracket)}
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-green-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <PieChart className="w-4 h-4 opacity-70" />
//                       Industry Dividend Yield
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {(selectedIndustry.AvgDividendYield * 100).toFixed(2)}%
//                     </p>
//                   </div>
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <TrendingUp className="w-4 h-4 opacity-70" />
//                       Range Frequency
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.CountInBracket}
//                     </p>
//                   </div>
//                   <div className="bg-gradient-to-br from-sky-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
//                     <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
//                       <BarChart2 className="w-4 h-4 opacity-70" />
//                       Company Count
//                     </div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                       {selectedIndustry.CompanyCount}
//                     </p>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>


//         {/* Right Section: Heatmap */}
//         <div className="w-full lg:w-1/2 mt-8 lg:mt-0" data-tour="home-hero">
//           {error ? (
//             <div className="text-center px-4 py-6 text-gray-600 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
//               Could not load industry visualization: {error}
//             </div>
//           ) : loading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 animate-pulse">
//               {[...Array(25)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="rounded-md h-24"
//                   style={{ backgroundColor: getGreenShade(0.5) }}
//                 ></div>
//               ))}
//             </div>
//           ) : heatmapData.length === 0 ? (
//             <div className="text-center px-4 py-6 text-gray-500 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
//               No industry data available
//             </div>
//           ) : (
//             <div className="relative w-full">
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1">
//                 {heatmapData.slice(0, 25).map((industry, index) => (
//                   <motion.div
//                     key={industry.industry}
//                     className="relative rounded-md cursor-pointer flex items-center justify-center p-3 bg-opacity-90 shadow-sm hover:shadow-md transition-shadow duration-200"
//                     style={{
//                       backgroundColor: getGreenShade(industry.intensity),
//                     }}
//                     whileHover={{ scale: 1.05 }}
//                     transition={{ type: 'spring', stiffness: 250, damping: 14 }}
//                     onClick={() => setSelectedIndustry(industry)}
//                     onMouseEnter={() => setHighlightedIndustry(index)}
//                     onMouseLeave={() => setHighlightedIndustry(null)}
//                   >
//                     {/* <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color: isDark ? '#e5e7eb' : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={isDark ? '#e5e7eb' : '#757b86ff'}
//                         />
//                       )}
//                       <p className={`text-xs font-medium text-wrap truncate w-full ${isDark ? '#e5e7eb' : '#374151'}`}>
//                         {industry.industry}
//                       </p>
//                       <p className={`text-xs ${isDark ? '#e5e7eb' : '#374151'}`}>
//                         {industry.DividendBracket}
//                       </p>
//                     </div> */}

//                     <div className="flex flex-col items-center justify-center text-center">
//                       {industryIcons[industry.industry] ? (
//                         React.createElement(industryIcons[industry.industry], {
//                           className: 'w-5 h-5 mb-2',
//                           strokeWidth: 1.5,
//                           color:
//                             industry.bgColor === '#065f46' // dark green background
//                               ? '#ffffff' // white icon
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#374151',
//                         })
//                       ) : (
//                         <PieChart
//                           className="w-5 h-5 mb-2"
//                           strokeWidth={1.5}
//                           color={
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#020202ff'
//                           }
//                         />
//                       )}

//                       {/* Industry Name */}
//                       <p
//                         className="text-xs font-bold font-medium text-wrap truncate w-full"
//                         style={{
//                           color:
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#e5e7eb'
//                                 : '#000000ef',
//                           WebkitTextStroke:
//                             industry.bgColor === '#065f46'
//                               ? '0.5px #fde6e6ff' // thin black outline for readability
//                               : '0px transparent',
//                         }}
//                       >
//                         {industry.industry}
//                       </p>

//                       {/* Dividend Bracket */}
//                       <p
//                         className="text-xs"
//                         style={{
//                           color:
//                             industry.bgColor === '#065f46'
//                               ? '#ffffff'
//                               : isDark
//                                 ? '#ffffffff'
//                                 : '#000000ff',
//                           WebkitTextStroke:
//                             industry.bgColor === '#065f46'
//                               ? '0.5px #d3cacaff'
//                               : '0px transparent',
//                         }}
//                       >
//                         {formatDividendBracket(industry.DividendBracket)}

//                       </p>
//                     </div>



//                     {highlightedIndustry === index && (
//                       <div className="absolute z-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md text-xs -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
//                         <p className="font-semibold text-gray-900 dark:text-gray-100">{industry.industry}</p>
//                         <p className="text-gray-600 dark:text-gray-300">
//                           Dividend Bracket Avg: {(industry.bracketAvg * 100).toFixed(2)}%
//                         </p>
//                       </div>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//               {/* <div className="mt-6 flex flex-col items-center">
//                 <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
//                   Dividend Bracket Average Heatmap (Top 25 Industries)
//                 </p>
//                 <div className="w-full max-w-xs flex items-center gap-2">
//                   <span className="text-xs text-gray-600 dark:text-gray-300">0.00%</span>
//                   <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 via-green-400 to-green-900"></div>
//                   <span className="text-xs text-gray-600 dark:text-gray-300">
//                     {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
//                   </span>
//                 </div>
//               </div> */}
//               <div className="mt-6 flex flex-col items-center">
//                 <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
//                   Dividend Bracket Average Heatmap (Top 25 Industries)
//                 </p>
//                 <div className="w-full max-w-md flex items-center gap-2">
//                   <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">0.00%</span>
//                   <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 to-green-900 dark:from-green-900 dark:to-green-100"></div>
//                   <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
//                     {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
//                   </span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Banner;



import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Sparkles, TrendingUp, BarChart2, PieChart, Factory, FlaskConical, DollarSign, Car, Code,
  HeartPulse, Scissors, ShoppingBag, Building2, Hammer, Wheat, Ship, Briefcase, Battery,
  Cpu, Droplets, Home, Banknote, Smartphone, Plane, Utensils, Zap, Recycle, Trees, Radio,
  Globe2, Microscope, Film, Beaker, Wrench, Shield, Truck, Satellite, Package, Server, Coins, BookOpen
} from 'lucide-react';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';

const Banner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highlightedIndustry, setHighlightedIndustry] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const API_BASE = import.meta.env.VITE_URL || `${window.location.origin}/api`;

  // Industry icons mapping
  const industryIcons = {
    "Pharmaceuticals & Drugs": HeartPulse,
    "Refineries": Factory,
    "Chemicals": FlaskConical,
    "Finance - NBFC": DollarSign,
    "Automobiles - Passenger Cars": Car,
    "IT - Software": Code,
    "Healthcare": HeartPulse,
    "Textile": Scissors,
    "Household & Personal Products": ShoppingBag,
    "Cement & Construction Materials": Building2,
    "Auto Ancillary": Hammer,
    "Electrodes & Welding Equipment": Hammer,
    "Pesticides & Agrochemicals": Wheat,
    "Shipping": Ship,
    "Finance - Investment": Banknote,
    "Insurance": Shield,
    "Telecom": Radio,
    "Media & Entertainment": Film,
    "Education": BookOpen,
    "Energy": Zap,
    "Power Generation & Distribution": Battery,
    "Diesel Engines": Droplets,
    "Aviation": Plane,
    "Hospitality": Utensils,
    "Real Estate": Home,
    "Automobile Two & Three Wheelers": Truck,
    "Defence": Shield,
    "Mining": Hammer,
    "Electric Equipment": Cpu,
    "Electronics": Smartphone,
    "Environment & Sustainability": Recycle,
    "Forestry & Paper": Trees,
    "Research & Development": Microscope,
    "Global Trade": Globe2,
    "Logistics": Package,
    "Engineering - Industrial Equipments": Server,
    "Finance - Asset Management": Coins,
    "Construction": Wrench,
    "Aerospace": Satellite,
    "Consulting": Briefcase,
  };

  // Parse dividend bracket
  const parseDividendBracket = (bracket) => {
    if (!bracket || typeof bracket !== 'string') return 0;
    const cleaned = bracket.replace(/[()[\]]/g, '').replace(/\s+/g, '');
    const parts = cleaned.split(',').map(Number);
    if (parts.length < 2) return 0;
    return (parts[0] + parts[1]) / 2;
  };

  // Get green shade based on intensity and theme
  const getGreenShade = (intensity) => {
    if (intensity === 0) return isDark ? "rgba(32, 88, 60, 1)" : "rgba(168, 219, 190, 1)";
    const normalizedIntensity = Math.min(1, Math.max(0, intensity));
    if (isDark) {
      const r = Math.round(6 + (100 - 6) * normalizedIntensity);
      const g = Math.round(95 + (200 - 95) * normalizedIntensity);
      const b = Math.round(70 + (150 - 70) * normalizedIntensity);
      return `rgb(${r},${g},${b})`;
    } else {
      const r = Math.round(212 - (212 - 6) * normalizedIntensity);
      const g = Math.round(244 - (244 - 95) * normalizedIntensity);
      const b = Math.round(226 - (226 - 70) * normalizedIntensity);
      return `rgb(${r},${g},${b})`;
    }
  };

  // Format dividend bracket for display
  const formatDividendBracket = (bracket) => {
    if (!bracket || typeof bracket !== "string") return "N/A";

    let cleaned = bracket.replace(/[()[\]]/g, "").replace(/\s+/g, "");

    if (cleaned.endsWith("+")) {
      const num = parseFloat(cleaned.replace("+", ""));
      return isNaN(num) ? "N/A" : `${(num * 100).toFixed(2)}%+`;
    }

    const parts = cleaned.split(/[-,]/).map(n => parseFloat(n)).filter(n => !isNaN(n));

    if (parts.length === 2) {
      return `${(parts[0] * 100).toFixed(2)}% - ${(parts[1] * 100).toFixed(2)}%`;
    }

    if (parts.length === 1) {
      return `${(parts[0] * 100).toFixed(2)}%`;
    }

    return "N/A";
  };

  // Detect dark mode preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = (e) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Fetch industry data
  useEffect(() => {
    const controller = new AbortController();
    const cacheDuration = 60 * 60 * 1000; // 1 hour

    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);
        setIndustries([]);

        const cachedData = localStorage.getItem('industryDividendData');
        const cacheTimestamp = localStorage.getItem('industryDividendDataTimestamp');
        let validIndustries = [];

        if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp) < cacheDuration) {
          const parsedData = JSON.parse(cachedData);
          validIndustries = parsedData.data
            .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
            .map((industry) => ({
              ...industry,
              bracketAvg: parseDividendBracket(industry.DividendBracket),
            }));
        } else {
          const response = await axios.get(`${API_BASE}/landpage/industry-dividend-yield`, { signal: controller.signal });
          if (response.data.status !== 'success' || !Array.isArray(response.data.data)) {
            throw new Error(response.data.message || 'API response is not valid');
          }
          validIndustries = response.data.data
            .filter((industry) => industry?.industry && Number.isFinite(industry.CountInBracket) && industry.DividendBracket)
            .map((industry) => ({
              ...industry,
              bracketAvg: parseDividendBracket(industry.DividendBracket),
            }));
          localStorage.setItem('industryDividendData', JSON.stringify(response.data));
          localStorage.setItem('industryDividendDataTimestamp', Date.now().toString());
        }

        if (validIndustries.length === 0) {
          setIndustries([]);
          setSelectedIndustry(null);
          setLoading(false);
          return;
        }

        setIndustries(validIndustries.slice(0, 25));
        if (validIndustries.length > 0) {
          setSelectedIndustry(validIndustries[0]);
        } else {
          setSelectedIndustry(null);
        }
        setLoading(false);
      } catch (error) {
        if (error.name === 'AbortError') return;
        setError(error.message || 'Failed to fetch industry data');
        setIndustries([]);
        setSelectedIndustry(null);
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => fetchIndustries(), 100);
    return () => {
      controller.abort();
      clearTimeout(debounceFetch);
    };
  }, []);

  // Format numbers for display
  const formatNumber = useCallback((num) => {
    if (num == null || isNaN(num) || typeof num !== 'number') return '₹0';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (absNum >= 1e7) return `${sign}₹${(absNum / 1e7).toLocaleString('en-IN', { minimumFractionDigits: 2 })}cr`;
    if (absNum >= 1e5) return `${sign}₹${(absNum / 1e5).toLocaleString('en-IN', { minimumFractionDigits: 2 })}L`;
    return `${sign}₹${Math.round(absNum).toLocaleString('en-IN')}`;
  }, []);

  // Calculate max bracket average
  const maxBracketAvg = useMemo(() => {
    if (industries.length === 0) return 1;
    const max = Math.max(...industries.map((industry) => industry.bracketAvg || 0));
    return max > 0 ? max : 1;
  }, [industries]);

  // Prepare heatmap data
  const heatmapData = useMemo(() => {
    if (!Array.isArray(industries) || industries.length === 0) return [];
    return industries.map((industry, index) => ({
      ...industry,
      intensity: industry.bracketAvg / maxBracketAvg,
      index,
    }));
  }, [industries, maxBracketAvg]);

  return (
    <div className="relative px-3 py-6 sm:py-12 min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div ref={ref} className="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-start justify-between gap-8 z-10">
        {/* Left Section: Title and Selected Industry Card */}
        <div className="w-full lg:w-1/2 text-gray-800 dark:text-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center lg:justify-start text-sky-600 dark:text-indigo-300 text-sm font-medium mb-2">
              <div className="flex items-center bg-sky-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Advanced Analytics Platform</span>
              </div>
            </div>

            <h1 className="mt-2 sm:mt-4 text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-center lg:text-left">
              Capital Market{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-300">
                Data Analytics
              </span>
              <span className="z-10 align-right inline-block -rotate-6 bg-white text-sky-600 dark:bg-slate-800 font-semibold text-xs sm:text-sm px-2 py-1 rounded-md border border-sky-300 dark:border-sky-600 shadow-sm">
                BETA
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto lg:mx-0 text-center lg:text-left min-h-[60px]">
              <Typewriter
                words={[
                  'Ratan Tata - "I do not believe in taking right decisions, I take decisions and then make them RIGHT."',
                  'Warren Buffett - "Risk Comes from Not knowing What you are doing"',
                  'Charlie Munger - "People calculate too much and think too little"',
                  'Mentor - "Value of money is determined by how it protects against uncertainties"',
                  'Charlie Munger - "Big money is in waiting when to buy and when to sell"',
                ]}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={60}
                deleteSpeed={30}
                delaySpeed={1500}
              />
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="animate-pulse flex flex-col items-center space-y-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-col space-y-1">
                        <div className="w-1/2 h-2 bg-gray-200 dark:bg-gray-600 rounded"></div>
                        <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : !selectedIndustry || industries.length === 0 ? (
              <motion.div
                key="no-data"
                className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                  No industry data available
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-md text-sm transition-all duration-200 shadow-md"
                >
                  Retry
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="data"
                className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden w-full max-w-md mx-auto lg:mx-0 p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                    style={{
                      backgroundColor: getGreenShade(selectedIndustry.intensity || 0),
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                  >
                    {industryIcons[selectedIndustry.industry] ? (
                      React.createElement(industryIcons[selectedIndustry.industry], {
                        className: 'w-6 h-6',
                        strokeWidth: 1.5,
                        color: isDark ? '#24262bff' : '#374151',
                      })
                    ) : (
                      <PieChart className="w-6 h-6" strokeWidth={1.5} color={isDark ? '#979899ff' : '#374151'} />
                    )}
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {selectedIndustry.industry}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Industry dividend overview
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-purple-100 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
                      <BarChart2 className="w-4 h-4 opacity-70" />
                      Dividend Range
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatDividendBracket(selectedIndustry.DividendBracket)}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-green-100 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
                      <PieChart className="w-4 h-4 opacity-70" />
                      Avg Dividend Yield
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {(selectedIndustry.AvgDividendYield * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-blue-100 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
                      <TrendingUp className="w-4 h-4 opacity-70" />
                      Range Frequency
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedIndustry.CountInBracket}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-sky-50 to-purple-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border border-purple-100 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-medium mb-1">
                      <BarChart2 className="w-4 h-4 opacity-70" />
                      Company Count
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedIndustry.CompanyCount}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section: Heatmap */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0" data-tour="home-hero">
          {error ? (
            <div className="text-center px-4 py-6 text-gray-600 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              Could not load industry visualization: {error}
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 animate-pulse">
              {[...Array(25)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg h-24"
                  style={{ backgroundColor: getGreenShade(0.5) }}
                ></div>
              ))}
            </div>
          ) : heatmapData.length === 0 ? (
            <div className="text-center px-4 py-6 text-gray-500 dark:text-gray-300 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              No industry data available
            </div>
          ) : (
            <div className="relative w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {heatmapData.slice(0, 25).map((industry, index) => (
                  <motion.div
                    key={industry.industry}
                    className="relative rounded-xl cursor-pointer flex items-center justify-center p-3 bg-opacity-90 shadow-sm hover:shadow-lg transition-all duration-200"
                    style={{
                      backgroundColor: getGreenShade(industry.intensity),
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 14 }}
                    onClick={() => setSelectedIndustry(industry)}
                    onMouseEnter={() => setHighlightedIndustry(index)}
                    onMouseLeave={() => setHighlightedIndustry(null)}
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      {industryIcons[industry.industry] ? (
                        React.createElement(industryIcons[industry.industry], {
                          className: 'w-5 h-5 mb-2',
                          strokeWidth: 1.5,
                          color: isDark ? '#111213ff' : '#374151',
                        })
                      ) : (
                        <PieChart
                          className="w-5 h-5 mb-2"
                          strokeWidth={1.5}
                          color={isDark ? '#1c1c1dff' : '#374151'}
                        />
                      )}
                      <p className="text-xs font-medium text-wrap truncate w-full text-gray-900 dark:text-white">
                        {industry.industry}
                      </p>
                      <p className="text-xs text-gray-700 dark:text-gray-300">
                        {formatDividendBracket(industry.DividendBracket)}
                      </p>
                    </div>

                    {highlightedIndustry === index && (
                      <div className="absolute z-20 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md text-xs -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{industry.industry}</p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Dividend Bracket Avg: {(industry.bracketAvg * 100).toFixed(2)}%
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex flex-col items-center">
                <p className="text-sm text-sky-600 dark:text-sky-300 font-medium mb-2">
                  Dividend Bracket Average Heatmap (Top 25 Industries)
                </p>
                <div className="w-full max-w-md flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">0.00%</span>
                  <div className="h-3 flex-1 rounded-full bg-gradient-to-r from-green-100 to-green-900 dark:from-green-900 dark:to-green-100"></div>
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {Math.max(...heatmapData.map(i => i.bracketAvg * 100)).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;