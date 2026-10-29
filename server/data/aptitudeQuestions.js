/**
 * Expanded seed question bank for the Aptitude Test module.
 *
 * Structure: { [category]: { easy: [...], medium: [...], hard: [...] } }
 * Each question: { id, questionText, options: [4 strings], correctIndex, explanation }
 *
 * 15 categories x 20 questions each (7 easy + 7 medium + 6 hard) = 300 questions.
 * Used by two flows: the 25-question mixed Full Aptitude Test (draws across
 * all categories) and per-topic Practice Tests (20 questions, one category).
 */

const bank = {
  "Quantitative Aptitude": {
    easy: [
      { id: "quant-e-1", questionText: "What is 15% of 200?", options: ["20", "30", "25", "35"], correctIndex: 1, explanation: "15% of 200 = (15/100) x 200 = 30." },
      { id: "quant-e-2", questionText: "If a pen costs Rs.12 and a notebook costs Rs.45, what is the total cost of 2 pens and 1 notebook?", options: ["Rs.69", "Rs.57", "Rs.81", "Rs.64"], correctIndex: 0, explanation: "2 pens = Rs.24, plus 1 notebook Rs.45 = Rs.69." },
      { id: "quant-e-3", questionText: "What is the average of 4, 8, 12, and 16?", options: ["8", "10", "12", "9"], correctIndex: 1, explanation: "Sum = 40, divided by 4 numbers = 10." },
      { id: "quant-e-4", questionText: "What is 1/4 of 96?", options: ["24", "20", "28", "32"], correctIndex: 0, explanation: "96 divided by 4 = 24." },
      { id: "quant-e-5", questionText: "If 3 notebooks cost Rs.90, what is the cost of 1 notebook?", options: ["Rs.30", "Rs.25", "Rs.35", "Rs.28"], correctIndex: 0, explanation: "90 divided by 3 = Rs.30 per notebook." },
      { id: "quant-e-6", questionText: "What is the value of 12 squared?", options: ["144", "124", "134", "154"], correctIndex: 0, explanation: "12 x 12 = 144." },
      { id: "quant-e-7", questionText: "Add: 245 + 389", options: ["634", "624", "644", "654"], correctIndex: 0, explanation: "245 + 389 = 634." },
    ],
    medium: [
      { id: "quant-m-1", questionText: "A train travels 360 km in 4 hours. What is its speed in km/h?", options: ["80", "90", "85", "95"], correctIndex: 1, explanation: "Speed = Distance/Time = 360/4 = 90 km/h." },
      { id: "quant-m-2", questionText: "If the ratio of boys to girls in a class of 40 is 3:5, how many girls are there?", options: ["15", "20", "25", "30"], correctIndex: 2, explanation: "Total parts = 3+5=8. Girls = (5/8)x40 = 25." },
      { id: "quant-m-3", questionText: "Simple interest on Rs.5000 at 10% per annum for 2 years is:", options: ["Rs.500", "Rs.1000", "Rs.1500", "Rs.2000"], correctIndex: 1, explanation: "SI = (P x R x T)/100 = (5000x10x2)/100 = Rs.1000." },
      { id: "quant-m-4", questionText: "A sum becomes Rs.1200 in 2 years and Rs.1320 in 3 years at simple interest. Find the rate of interest.", options: ["12.5%", "10%", "15%", "8%"], correctIndex: 0, explanation: "Extra year's SI = 1320-1200 = 120/year. Principal = 1200 - 2x120 = 960. Rate = (120x100)/960 = 12.5%." },
      { id: "quant-m-5", questionText: "A father is 3 times as old as his son. After 12 years, he will be twice as old. Find the son's present age.", options: ["12", "10", "15", "14"], correctIndex: 0, explanation: "Let son=x, father=3x. 3x+12 = 2(x+12) gives x=12." },
      { id: "quant-m-6", questionText: "Find the average of the first 10 odd numbers.", options: ["10", "9", "11", "12"], correctIndex: 0, explanation: "First 10 odd numbers (1 to 19) sum to 100; average = 100/10 = 10." },
      { id: "quant-m-7", questionText: "A shopkeeper sells an item for Rs.690 after giving an 8% discount on the marked price. Find the marked price.", options: ["Rs.750", "Rs.720", "Rs.700", "Rs.780"], correctIndex: 0, explanation: "MP x 0.92 = 690, so MP = 690/0.92 = Rs.750." },
    ],
    hard: [
      { id: "quant-h-1", questionText: "A can do a piece of work in 12 days, B in 15 days. Working together, in how many days will they finish it?", options: ["6.67", "7.5", "8", "5"], correctIndex: 0, explanation: "Combined rate = 1/12 + 1/15 = 9/60 = 3/20 per day. Days = 20/3 ~ 6.67." },
      { id: "quant-h-2", questionText: "The compound interest on Rs.8000 at 10% per annum for 2 years (compounded annually) is:", options: ["Rs.1600", "Rs.1680", "Rs.1640", "Rs.1700"], correctIndex: 1, explanation: "Amount = 8000x1.1x1.1 = 9680. CI = 9680-8000 = Rs.1680." },
      { id: "quant-h-3", questionText: "Two trains of length 120m and 180m run towards each other on parallel tracks at 54 km/h and 36 km/h. How long do they take to cross each other?", options: ["10s", "12s", "14s", "8s"], correctIndex: 1, explanation: "Relative speed = 90 km/h = 25 m/s. Total length = 300m. Time = 300/25 = 12s." },
      { id: "quant-h-4", questionText: "Find the compound interest on Rs.12000 for 1.5 years at 10% per annum, compounded half-yearly.", options: ["Rs.1891.5", "Rs.1800", "Rs.1950", "Rs.2000"], correctIndex: 0, explanation: "Half-yearly rate=5%, 3 periods: 12000x1.05^3=13891.5. CI=1891.5." },
      { id: "quant-h-5", questionText: "A and B invest in a business in the ratio 3:5. If the total profit is Rs.16000, find B's share.", options: ["Rs.10,000", "Rs.9,000", "Rs.8,000", "Rs.6,000"], correctIndex: 0, explanation: "B's share = (5/8) x 16000 = Rs.10,000." },
      { id: "quant-h-6", questionText: "The average of 5 consecutive even numbers is 26. Find the largest number.", options: ["30", "28", "32", "26"], correctIndex: 0, explanation: "The numbers are 22,24,26,28,30 (average 26); largest is 30." },
    ],
  },

  "Logical Reasoning": {
    easy: [
      { id: "logic-e-1", questionText: "Find the odd one out: Apple, Mango, Carrot, Banana", options: ["Apple", "Mango", "Carrot", "Banana"], correctIndex: 2, explanation: "Carrot is a vegetable; the rest are fruits." },
      { id: "logic-e-2", questionText: "Complete the series: 2, 4, 6, 8, ?", options: ["9", "10", "12", "11"], correctIndex: 1, explanation: "Series increases by 2 each time, so next is 10." },
      { id: "logic-e-3", questionText: "If FRIEND is coded as GSJFOE (each letter shifted +1), how is CANDLE coded?", options: ["DBOEMF", "DBOEMG", "CBOEMF", "DCOEMF"], correctIndex: 0, explanation: "Shift each letter by +1: C to D, A to B, N to O, D to E, L to M, E to F = DBOEMF." },
      { id: "logic-e-4", questionText: "Find the odd one: Triangle, Square, Circle, Apple", options: ["Triangle", "Square", "Circle", "Apple"], correctIndex: 3, explanation: "Apple is a fruit, not a geometric shape." },
      { id: "logic-e-5", questionText: "Complete the series: 1, 4, 9, 16, ?", options: ["25", "20", "24", "36"], correctIndex: 0, explanation: "These are perfect squares (1,2,3,4,5 squared); next is 5 squared = 25." },
      { id: "logic-e-6", questionText: "If A=1, B=2, ... Z=26, what is the sum of the letters in 'CAT'?", options: ["24", "21", "26", "23"], correctIndex: 0, explanation: "C(3)+A(1)+T(20) = 24." },
      { id: "logic-e-7", questionText: "Which number doesn't belong with the others: 2, 3, 5, 9, 11?", options: ["2", "3", "9", "11"], correctIndex: 2, explanation: "9 is not prime (3x3); all the others are prime numbers." },
    ],
    medium: [
      { id: "logic-m-1", questionText: "Find the next number: 5, 11, 23, 47, ?", options: ["94", "95", "96", "93"], correctIndex: 1, explanation: "Each term = previous x2 + 1: 47x2+1 = 95." },
      { id: "logic-m-2", questionText: "Pointing to a photo, Ravi said, 'She is the daughter of my grandfather's only son.' How is she related to Ravi?", options: ["Sister", "Cousin", "Daughter", "Niece"], correctIndex: 0, explanation: "Grandfather's only son is Ravi's father, so her father is Ravi's father too - she is Ravi's sister." },
      { id: "logic-m-3", questionText: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?", options: ["Yes", "No", "Cannot be determined", "Only some"], correctIndex: 0, explanation: "This is a transitive chain: Bloops are within Razzies which are within Lazzies, so all Bloops are definitely Lazzies." },
      { id: "logic-m-4", questionText: "Find the missing number: 3, 6, 12, 24, ?, 96", options: ["48", "40", "50", "60"], correctIndex: 0, explanation: "Each term doubles the previous: 24x2=48, and 48x2=96 confirms the pattern." },
      { id: "logic-m-5", questionText: "Statement: All cats are animals. Some animals are wild. Conclusion: Some cats are wild. Is this conclusion valid?", options: ["Invalid - cannot be concluded", "Valid", "Always true", "Always false"], correctIndex: 0, explanation: "The wild animals mentioned aren't confirmed to be cats specifically, so the conclusion doesn't logically follow." },
      { id: "logic-m-6", questionText: "If 'BOOK' is coded as 'CPPL' (each letter +1), what is 'PEN' coded as?", options: ["QFO", "QFP", "PFO", "QGO"], correctIndex: 0, explanation: "Shift each letter by +1: P to Q, E to F, N to O = QFO." },
      { id: "logic-m-7", questionText: "A is the son of B. C is the mother of A. How is B related to C?", options: ["Husband", "Brother", "Father", "Son"], correctIndex: 0, explanation: "B and C are A's parents, with C being the mother, so B (the other parent) is C's husband." },
    ],
    hard: [
      { id: "logic-h-1", questionText: "In a certain code, COMPUTER is written as RFUVQNPC. How is MONITOR written in that code?", options: ["RQTIONM", "ROTINOM", "MROTINO", "ROTINMO"], correctIndex: 0, explanation: "The code reverses the word and shifts letters - applying the same transformation to MONITOR gives RQTIONM." },
      { id: "logic-h-2", questionText: "Five friends sit in a row. A is to the right of B but left of C. D is right of C and left of E. Who sits in the middle?", options: ["A", "B", "C", "D"], correctIndex: 2, explanation: "Order is B, A, C, D, E - so C sits in the middle (3rd of 5)." },
      { id: "logic-h-3", questionText: "A is twice as old as B was 2 years ago. If their present total age is 40, what is A's present age?", options: ["26", "24", "28", "22"], correctIndex: 0, explanation: "Solving A = 2(B-2) with A+B=40 gives the classic answer A=26, B=14." },
      { id: "logic-h-4", questionText: "In a row of 20 students, P is 7th from the left. How many students are to the right of P?", options: ["13", "12", "14", "7"], correctIndex: 0, explanation: "Students to the right = 20 - 7 = 13." },
      { id: "logic-h-5", questionText: "If the day before yesterday was Wednesday, what day will tomorrow be?", options: ["Saturday", "Sunday", "Friday", "Monday"], correctIndex: 0, explanation: "Day before yesterday=Wednesday means today is Friday, so tomorrow is Saturday." },
      { id: "logic-h-6", questionText: "A is the father of B. C is the brother of A. D is the son of C. How is D related to B?", options: ["Cousin", "Brother", "Uncle", "Nephew"], correctIndex: 0, explanation: "A and C are siblings; B is A's child and D is C's child, making B and D cousins." },
    ],
  },

  "Verbal Ability": {
    easy: [
      { id: "verbal-e-1", questionText: "Choose the synonym of 'Happy':", options: ["Sad", "Joyful", "Angry", "Tired"], correctIndex: 1, explanation: "'Joyful' means feeling or showing great happiness, the closest synonym." },
      { id: "verbal-e-2", questionText: "Choose the antonym of 'Increase':", options: ["Grow", "Decrease", "Expand", "Rise"], correctIndex: 1, explanation: "'Decrease' means to become smaller, the opposite of 'increase'." },
      { id: "verbal-e-3", questionText: "Fill in the blank: She ___ to the office every day.", options: ["go", "goes", "going", "gone"], correctIndex: 1, explanation: "Subject 'She' (3rd person singular) takes 'goes' in present tense." },
      { id: "verbal-e-4", questionText: "Choose the synonym of 'Begin':", options: ["Start", "End", "Stop", "Pause"], correctIndex: 0, explanation: "'Start' means to begin, the closest synonym." },
      { id: "verbal-e-5", questionText: "Choose the antonym of 'Brave':", options: ["Cowardly", "Bold", "Strong", "Fearless"], correctIndex: 0, explanation: "'Cowardly' is the opposite of being brave." },
      { id: "verbal-e-6", questionText: "Fill in the blank: They ___ playing football now.", options: ["is", "are", "am", "be"], correctIndex: 1, explanation: "Plural subject 'They' takes 'are' in present continuous tense." },
      { id: "verbal-e-7", questionText: "Choose the plural of 'Child':", options: ["Childs", "Children", "Childes", "Childrens"], correctIndex: 1, explanation: "'Children' is the irregular plural form of 'Child'." },
    ],
    medium: [
      { id: "verbal-m-1", questionText: "Choose the correctly spelled word:", options: ["Recieve", "Receive", "Receeve", "Receve"], correctIndex: 1, explanation: "'Receive' follows the 'i before e except after c' rule correctly." },
      { id: "verbal-m-2", questionText: "Identify the part of speech of 'quickly' in 'He ran quickly':", options: ["Noun", "Verb", "Adjective", "Adverb"], correctIndex: 3, explanation: "'Quickly' modifies the verb 'ran', describing how the action was done - that's an adverb." },
      { id: "verbal-m-3", questionText: "Choose the correct passive voice: 'She writes a letter.'", options: ["A letter is written by her.", "A letter was written by her.", "A letter writes her.", "A letter is wrote by her."], correctIndex: 0, explanation: "Present tense active 'writes' becomes 'is written' in passive voice." },
      { id: "verbal-m-4", questionText: "Choose the correctly spelled word:", options: ["Definately", "Definitely", "Definitly", "Difinitely"], correctIndex: 1, explanation: "'Definitely' is the correct spelling." },
      { id: "verbal-m-5", questionText: "Identify the figure of speech: 'The wind whispered through the trees.'", options: ["Personification", "Simile", "Metaphor", "Hyperbole"], correctIndex: 0, explanation: "Giving the wind a human action (whispering) is personification." },
      { id: "verbal-m-6", questionText: "Choose the correct sentence:", options: ["She don't like tea.", "She doesn't likes tea.", "She doesn't like tea.", "She not like tea."], correctIndex: 2, explanation: "'She doesn't like tea' correctly pairs the singular subject with 'doesn't' and the base verb form." },
      { id: "verbal-m-7", questionText: "Choose the word closest in meaning to 'Benevolent':", options: ["Kind", "Cruel", "Selfish", "Greedy"], correctIndex: 0, explanation: "'Benevolent' means kind and generous." },
    ],
    hard: [
      { id: "verbal-h-1", questionText: "Choose the word that best completes: 'His argument was so ___ that no one could refute it.'", options: ["Cogent", "Vague", "Trivial", "Weak"], correctIndex: 0, explanation: "'Cogent' means clear and logically convincing, fitting an argument that can't be refuted." },
      { id: "verbal-h-2", questionText: "Identify the error: 'Neither of the students have submitted their assignment.'", options: ["Neither", "have", "their", "No error"], correctIndex: 1, explanation: "'Neither' is singular, so it should take 'has', not 'have'." },
      { id: "verbal-h-3", questionText: "Choose the correct idiom meaning 'to reveal a secret':", options: ["Spill the beans", "Hit the sack", "Break a leg", "Under the weather"], correctIndex: 0, explanation: "'Spill the beans' is the idiom meaning to reveal secret information." },
      { id: "verbal-h-4", questionText: "Choose the word most nearly OPPOSITE to 'Meticulous':", options: ["Careless", "Careful", "Precise", "Thorough"], correctIndex: 0, explanation: "'Meticulous' means very careful and precise; 'careless' is its opposite." },
      { id: "verbal-h-5", questionText: "Identify the error: 'Each of the boys have submitted his project.'", options: ["Each", "have", "his", "No error"], correctIndex: 1, explanation: "'Each' is singular, so it should take 'has', not 'have'." },
      { id: "verbal-h-6", questionText: "Choose the correct idiom meaning 'extremely happy':", options: ["On cloud nine", "Under the weather", "Once in a blue moon", "Beat around the bush"], correctIndex: 0, explanation: "'On cloud nine' is the idiom meaning extremely happy." },
    ],
  },

  "Data Interpretation": {
    easy: [
      { id: "di-e-1", questionText: "A pie chart shows Sales=40%, Marketing=30%, R&D=30%. If total budget is Rs.100,000, what is the Sales budget?", options: ["Rs.30,000", "Rs.40,000", "Rs.35,000", "Rs.45,000"], correctIndex: 1, explanation: "40% of Rs.100,000 = Rs.40,000." },
      { id: "di-e-2", questionText: "If a bar chart shows monthly sales of 10, 20, 15, 25 (in units), what is the total for the 4 months?", options: ["60", "65", "70", "75"], correctIndex: 2, explanation: "10+20+15+25 = 70." },
      { id: "di-e-3", questionText: "A table shows Product A sold 200 units and Product B sold 150 units. What % more did A sell than B?", options: ["25%", "33.3%", "20%", "30%"], correctIndex: 1, explanation: "Difference = 50. 50/150 x 100 ~ 33.3%." },
      { id: "di-e-4", questionText: "A pie chart shows 4 departments equally at 25% each. If total employees = 200, how many are in each department?", options: ["50", "40", "45", "55"], correctIndex: 0, explanation: "25% of 200 = 50 employees per department." },
      { id: "di-e-5", questionText: "A bar graph shows weekly sales: 100, 150, 120, 130. Find the average weekly sales.", options: ["125", "120", "130", "135"], correctIndex: 0, explanation: "Sum = 500, divided by 4 weeks = 125." },
      { id: "di-e-6", questionText: "A table shows rainfall of 50mm, 70mm, 60mm for 3 months. Find the total rainfall.", options: ["180mm", "170mm", "190mm", "160mm"], correctIndex: 0, explanation: "50+70+60 = 180mm." },
      { id: "di-e-7", questionText: "If a chart shows 60% of 50 students passed, how many students passed?", options: ["30", "25", "35", "28"], correctIndex: 0, explanation: "60% of 50 = 30 students." },
    ],
    medium: [
      { id: "di-m-1", questionText: "In a line graph, revenue grew from Rs.50L to Rs.65L in a year. What is the % growth?", options: ["25%", "30%", "20%", "35%"], correctIndex: 1, explanation: "Growth = 15L. 15/50 x 100 = 30%." },
      { id: "di-m-2", questionText: "If a company's expenses are 60% of revenue and revenue is Rs.10,00,000, what is the profit?", options: ["Rs.3,00,000", "Rs.4,00,000", "Rs.6,00,000", "Rs.4,50,000"], correctIndex: 1, explanation: "Expenses = 60% of 10L = 6L. Profit = 10L - 6L = Rs.4,00,000." },
      { id: "di-m-3", questionText: "A survey shows 120 out of 300 people prefer tea over coffee. What percentage prefer coffee?", options: ["40%", "60%", "50%", "65%"], correctIndex: 1, explanation: "180 out of 300 prefer coffee. 180/300 x 100 = 60%." },
      { id: "di-m-4", questionText: "Sales grew from 200 units to 250 units. Find the percentage increase.", options: ["25%", "20%", "30%", "15%"], correctIndex: 0, explanation: "Increase = 50. 50/200 x 100 = 25%." },
      { id: "di-m-5", questionText: "A pie chart shows Product A=45%, B=35%, C=20% of total revenue Rs.2,00,000. Find revenue from B.", options: ["Rs.70,000", "Rs.90,000", "Rs.40,000", "Rs.60,000"], correctIndex: 0, explanation: "35% of Rs.2,00,000 = Rs.70,000." },
      { id: "di-m-6", questionText: "A company's profit margin was 15% on revenue of Rs.8,00,000. Find the profit.", options: ["Rs.1,20,000", "Rs.1,00,000", "Rs.1,50,000", "Rs.80,000"], correctIndex: 0, explanation: "15% of Rs.8,00,000 = Rs.1,20,000." },
      { id: "di-m-7", questionText: "In a survey of 400 people, 25% prefer brand X. How many prefer other brands?", options: ["300", "250", "280", "320"], correctIndex: 0, explanation: "Brand X = 100 people, so others = 400-100 = 300." },
    ],
    hard: [
      { id: "di-h-1", questionText: "Quarterly profits were Rs.2L, Rs.3L, Rs.2.5L, Rs.4L. What is the average quarterly growth rate approx?", options: ["~12%", "~25%", "~18%", "~30%"], correctIndex: 2, explanation: "Averaging the quarter-over-quarter % changes works out to roughly 18%." },
      { id: "di-h-2", questionText: "If a stock rose 20% then fell 20%, what is the net % change from the original price?", options: ["0%", "-4%", "+4%", "-2%"], correctIndex: 1, explanation: "1.2 x 0.8 = 0.96, meaning a net 4% decrease from the original." },
      { id: "di-h-3", questionText: "A factory's output increased by 10% each year for 2 years from 1000 units. What is the output now?", options: ["1200", "1210", "1190", "1220"], correctIndex: 1, explanation: "1000 x 1.1 x 1.1 = 1210." },
      { id: "di-h-4", questionText: "Revenue grew 20% in Year 1 and fell 10% in Year 2, from an initial Rs.5,00,000. Find the final revenue.", options: ["Rs.5,40,000", "Rs.5,00,000", "Rs.5,60,000", "Rs.4,80,000"], correctIndex: 0, explanation: "5,00,000 x 1.2 x 0.9 = Rs.5,40,000." },
      { id: "di-h-5", questionText: "A company's costs are 70% of revenue. If profit is Rs.90,000, find the revenue.", options: ["Rs.3,00,000", "Rs.2,70,000", "Rs.3,50,000", "Rs.2,50,000"], correctIndex: 0, explanation: "Profit margin = 30%. Revenue = 90,000/0.3 = Rs.3,00,000." },
      { id: "di-h-6", questionText: "Two products have profit margins of 20% and 25% on revenues of Rs.1,00,000 and Rs.80,000. Find the combined profit.", options: ["Rs.40,000", "Rs.45,000", "Rs.35,000", "Rs.50,000"], correctIndex: 0, explanation: "1,00,000x0.2 + 80,000x0.25 = 20,000+20,000 = Rs.40,000." },
    ],
  },

  "Coding Fundamentals": {
    easy: [
      { id: "code-e-1", questionText: "What is the time complexity of accessing an element in an array by index?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctIndex: 2, explanation: "Arrays support direct indexed access in constant time, O(1)." },
      { id: "code-e-2", questionText: "Which data structure uses LIFO (Last In First Out) order?", options: ["Queue", "Stack", "Array", "Linked List"], correctIndex: 1, explanation: "A Stack follows LIFO - the last element pushed is the first popped." },
      { id: "code-e-3", questionText: "What does 'API' stand for?", options: ["Application Programming Interface", "Applied Program Instruction", "Array Programming Index", "Application Process Integration"], correctIndex: 0, explanation: "API stands for Application Programming Interface." },
      { id: "code-e-4", questionText: "Which of these is NOT a programming paradigm?", options: ["Object-Oriented", "Functional", "Alphabetical", "Procedural"], correctIndex: 2, explanation: "'Alphabetical' is not a programming paradigm; the other three are well-known paradigms." },
      { id: "code-e-5", questionText: "What does 'CPU' stand for?", options: ["Central Processing Unit", "Central Program Unit", "Computer Processing Unit", "Central Processor Utility"], correctIndex: 0, explanation: "CPU stands for Central Processing Unit." },
      { id: "code-e-6", questionText: "Which language is primarily used for styling web pages?", options: ["CSS", "HTML", "Python", "SQL"], correctIndex: 0, explanation: "CSS (Cascading Style Sheets) is used for styling web pages." },
      { id: "code-e-7", questionText: "What is the output of 5 % 2 in most programming languages?", options: ["1", "2", "0", "2.5"], correctIndex: 0, explanation: "The modulo operator gives the remainder: 5 divided by 2 leaves remainder 1." },
    ],
    medium: [
      { id: "code-m-1", questionText: "What is the average time complexity of binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 1, explanation: "Binary search halves the search space each step, giving O(log n)." },
      { id: "code-m-2", questionText: "In SQL, which keyword is used to remove duplicate rows from a result set?", options: ["UNIQUE", "DISTINCT", "FILTER", "GROUP"], correctIndex: 1, explanation: "The DISTINCT keyword removes duplicate rows from query results." },
      { id: "code-m-3", questionText: "Which sorting algorithm has the best average-case time complexity?", options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"], correctIndex: 2, explanation: "Quick Sort has O(n log n) average-case complexity, better than the others listed." },
      { id: "code-m-4", questionText: "Which data structure follows FIFO (First In First Out) order?", options: ["Queue", "Stack", "Tree", "Graph"], correctIndex: 0, explanation: "A Queue follows FIFO - the first element added is the first removed." },
      { id: "code-m-5", questionText: "What is the space complexity of an algorithm using a fixed amount of extra memory regardless of input size?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], correctIndex: 0, explanation: "Constant extra space regardless of input size is O(1) space complexity." },
      { id: "code-m-6", questionText: "In Git, which command creates a new branch?", options: ["git branch <name>", "git commit", "git push", "git merge"], correctIndex: 0, explanation: "'git branch <name>' creates a new branch in Git." },
      { id: "code-m-7", questionText: "Which HTTP method is typically used to update an existing resource?", options: ["PUT", "GET", "DELETE", "HEAD"], correctIndex: 0, explanation: "PUT is conventionally used to update an existing resource." },
    ],
    hard: [
      { id: "code-h-1", questionText: "What is the time complexity of building a heap from n elements?", options: ["O(n log n)", "O(n)", "O(log n)", "O(n^2)"], correctIndex: 1, explanation: "Heapify-based heap construction runs in O(n), a tighter bound than the naive O(n log n)." },
      { id: "code-h-2", questionText: "In a hash table with good hashing, what is the average time complexity of lookup?", options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], correctIndex: 2, explanation: "With a good hash function and low collision rate, lookup is O(1) on average." },
      { id: "code-h-3", questionText: "Which of these problems is famously NP-complete?", options: ["Binary Search", "Travelling Salesman Problem", "Merge Sort", "Linear Search"], correctIndex: 1, explanation: "The Travelling Salesman Problem (decision version) is a classic NP-complete problem." },
      { id: "code-h-4", questionText: "What is the worst-case time complexity of Quick Sort?", options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"], correctIndex: 0, explanation: "Quick Sort degrades to O(n^2) in the worst case (e.g. already-sorted input with a poor pivot choice)." },
      { id: "code-h-5", questionText: "Which of these sorting algorithms is NOT comparison-based?", options: ["Radix Sort", "Merge Sort", "Quick Sort", "Bubble Sort"], correctIndex: 0, explanation: "Radix Sort sorts by digit/place value rather than comparing elements directly." },
      { id: "code-h-6", questionText: "What is the time complexity of Dijkstra's algorithm using a min-heap?", options: ["O((V+E) log V)", "O(V^2)", "O(E log E)", "O(V+E)"], correctIndex: 0, explanation: "With a min-heap priority queue, Dijkstra's algorithm runs in O((V+E) log V)." },
    ],
  },

  "Probability": {
    easy: [
      { id: "prob-e-1", questionText: "A coin is tossed once. What is the probability of getting heads?", options: ["1/2", "1/4", "1", "0"], correctIndex: 0, explanation: "A fair coin has 2 equally likely outcomes, so P(heads) = 1/2." },
      { id: "prob-e-2", questionText: "A bag has 3 red and 2 blue balls. What is the probability of picking a red ball?", options: ["3/5", "2/5", "1/5", "1/2"], correctIndex: 0, explanation: "3 favorable out of 5 total balls = 3/5." },
      { id: "prob-e-3", questionText: "A die is rolled once. What is the probability of getting an even number?", options: ["1/2", "1/3", "1/6", "2/3"], correctIndex: 0, explanation: "Even outcomes are 2,4,6 (3 out of 6) = 1/2." },
      { id: "prob-e-4", questionText: "A bag has 10 balls numbered 1-10. What is the probability of drawing an even number?", options: ["1/2", "1/5", "2/5", "1/10"], correctIndex: 0, explanation: "5 even numbers out of 10 = 1/2." },
      { id: "prob-e-5", questionText: "A coin is tossed twice. What is the probability of getting two tails?", options: ["1/4", "1/2", "1/8", "3/4"], correctIndex: 0, explanation: "P(tail)xP(tail) = 1/2x1/2 = 1/4." },
      { id: "prob-e-6", questionText: "A die is rolled. What is the probability of getting a number greater than 4?", options: ["1/3", "1/2", "1/6", "2/3"], correctIndex: 0, explanation: "Numbers 5 and 6 qualify (2 out of 6) = 1/3." },
      { id: "prob-e-7", questionText: "A bag has 5 black and 5 white balls. What is the probability of drawing a black ball?", options: ["1/2", "1/3", "2/5", "3/5"], correctIndex: 0, explanation: "5 black out of 10 total = 1/2." },
    ],
    medium: [
      { id: "prob-m-1", questionText: "Two dice are rolled. What is the probability of getting a sum of 7?", options: ["1/6", "1/12", "1/36", "5/36"], correctIndex: 0, explanation: "6 combinations give a sum of 7, out of 36 total = 6/36 = 1/6." },
      { id: "prob-m-2", questionText: "A card is drawn from a standard deck of 52. What is the probability it's a king?", options: ["1/13", "1/52", "1/4", "4/13"], correctIndex: 0, explanation: "There are 4 kings out of 52 cards = 4/52 = 1/13." },
      { id: "prob-m-3", questionText: "A bag has 4 white and 6 black balls. Two balls are drawn without replacement. What is the probability both are white?", options: ["2/15", "4/10", "1/15", "3/15"], correctIndex: 0, explanation: "P = (4/10) x (3/9) = 12/90 = 2/15." },
      { id: "prob-m-4", questionText: "Two coins are tossed. What is the probability of getting at least one head?", options: ["3/4", "1/2", "1/4", "1/3"], correctIndex: 0, explanation: "P(no heads) = 1/4, so P(at least one head) = 1 - 1/4 = 3/4." },
      { id: "prob-m-5", questionText: "A card is drawn from a deck. What is the probability it's a red card?", options: ["1/2", "1/4", "1/13", "1/26"], correctIndex: 0, explanation: "26 red cards out of 52 = 1/2." },
      { id: "prob-m-6", questionText: "A bag has 3 red, 4 blue, 5 green balls. Find the probability of drawing a blue ball.", options: ["1/3", "1/4", "1/2", "1/6"], correctIndex: 0, explanation: "4 blue out of 12 total = 1/3." },
      { id: "prob-m-7", questionText: "Two dice are rolled. Find the probability of getting a sum of 8.", options: ["5/36", "1/6", "1/9", "1/12"], correctIndex: 0, explanation: "5 combinations give a sum of 8, out of 36 total = 5/36." },
    ],
    hard: [
      { id: "prob-h-1", questionText: "Three coins are tossed. What is the probability of getting exactly two heads?", options: ["3/8", "1/2", "1/4", "3/4"], correctIndex: 0, explanation: "Out of 8 equally likely outcomes, 3 have exactly two heads (HHT, HTH, THH) = 3/8." },
      { id: "prob-h-2", questionText: "A bag has 5 red and 7 green balls. One ball is drawn. Find the probability it is NOT green.", options: ["5/12", "7/12", "5/7", "1/12"], correctIndex: 0, explanation: "Not green means red: 5 out of 12 total balls = 5/12." },
      { id: "prob-h-3", questionText: "In a class of 30, 18 play cricket, 12 play football, 6 play both. What is the probability a randomly selected student plays neither?", options: ["1/5", "1/6", "1/3", "4/5"], correctIndex: 0, explanation: "Playing at least one = 18+12-6=24. Neither = 30-24=6. Probability = 6/30 = 1/5." },
      { id: "prob-h-4", questionText: "A box has 4 defective and 16 good items. Two items are drawn without replacement. Find the probability both are good.", options: ["12/19", "4/5", "3/4", "1/2"], correctIndex: 0, explanation: "P = (16/20) x (15/19) = 240/380 = 12/19." },
      { id: "prob-h-5", questionText: "A family has 3 children. What is the probability that exactly 2 are girls (assume equal probability)?", options: ["3/8", "1/2", "1/4", "1/8"], correctIndex: 0, explanation: "C(3,2)=3 favorable outcomes out of 8 total = 3/8." },
      { id: "prob-h-6", questionText: "From a deck of 52 cards, 2 cards are drawn without replacement. Find the probability both are aces.", options: ["1/221", "1/169", "1/13", "1/26"], correctIndex: 0, explanation: "P = (4/52) x (3/51) = 12/2652 = 1/221." },
    ],
  },

  "Permutation & Combination": {
    easy: [
      { id: "pnc-e-1", questionText: "How many ways can 3 books be arranged on a shelf?", options: ["6", "3", "9", "12"], correctIndex: 0, explanation: "3 distinct items can be arranged in 3! = 6 ways." },
      { id: "pnc-e-2", questionText: "In how many ways can you select 2 fruits out of 5 different fruits?", options: ["10", "20", "5", "15"], correctIndex: 0, explanation: "This is a combination: C(5,2) = 10." },
      { id: "pnc-e-3", questionText: "How many 2-letter words (with repetition allowed) can be formed from 4 letters A, B, C, D?", options: ["16", "12", "8", "20"], correctIndex: 0, explanation: "Each of the 2 positions has 4 choices: 4x4 = 16." },
      { id: "pnc-e-4", questionText: "How many ways can the letters of the word 'CAT' be arranged?", options: ["6", "3", "9", "2"], correctIndex: 0, explanation: "3 distinct letters can be arranged in 3! = 6 ways." },
      { id: "pnc-e-5", questionText: "In how many ways can a person choose 1 shirt out of 4 and 1 pant out of 3?", options: ["12", "7", "9", "15"], correctIndex: 0, explanation: "4 x 3 = 12 combinations." },
      { id: "pnc-e-6", questionText: "How many 3-digit numbers can be formed using digits 1-5 without repetition?", options: ["60", "125", "15", "20"], correctIndex: 0, explanation: "5 x 4 x 3 = 60." },
      { id: "pnc-e-7", questionText: "How many ways can 2 prizes be given to 2 different students chosen out of 5?", options: ["20", "10", "25", "15"], correctIndex: 0, explanation: "This is a permutation: 5 x 4 = 20." },
    ],
    medium: [
      { id: "pnc-m-1", questionText: "How many ways can 4 people be seated in a row?", options: ["24", "12", "16", "20"], correctIndex: 0, explanation: "4 distinct people can be arranged in 4! = 24 ways." },
      { id: "pnc-m-2", questionText: "In how many ways can a committee of 3 be formed from a group of 10 people (no restrictions)?", options: ["120", "100", "90", "150"], correctIndex: 0, explanation: "C(10,3) = 10!/(3!x7!) = 120." },
      { id: "pnc-m-3", questionText: "How many distinct arrangements of the letters in 'LEVEL' are there?", options: ["30", "60", "120", "20"], correctIndex: 0, explanation: "5 letters with L repeated twice and E repeated twice: 5!/(2!x2!) = 30." },
      { id: "pnc-m-4", questionText: "How many ways can 6 people be arranged in a circle?", options: ["120", "720", "60", "360"], correctIndex: 0, explanation: "Circular arrangements of n people = (n-1)!: (6-1)! = 120." },
      { id: "pnc-m-5", questionText: "In how many ways can a hand of 5 cards be dealt from a deck of 52?", options: ["2,598,960", "2,000,000", "1,326", "52"], correctIndex: 0, explanation: "C(52,5) = 2,598,960." },
      { id: "pnc-m-6", questionText: "How many ways can you select a team of 4 from 6 boys and 4 girls (no restriction)?", options: ["210", "200", "120", "180"], correctIndex: 0, explanation: "Total people = 10, C(10,4) = 210." },
      { id: "pnc-m-7", questionText: "How many distinct arrangements are there of the letters in 'STATISTICS'?", options: ["50400", "25200", "100800", "12600"], correctIndex: 0, explanation: "10 letters with S=3, T=3, I=2: 10!/(3!x3!x2!) = 50400." },
    ],
    hard: [
      { id: "pnc-h-1", questionText: "How many ways can 5 different books be distributed among 3 students so that each student gets at least one book?", options: ["150", "125", "100", "243"], correctIndex: 0, explanation: "Using surjections: 3^5 - C(3,1)x2^5 + C(3,2)x1^5 = 243 - 96 + 3 = 150." },
      { id: "pnc-h-2", questionText: "From a group of 8 people, in how many ways can a president and a vice-president be chosen (different people)?", options: ["56", "64", "28", "48"], correctIndex: 0, explanation: "This is a permutation of 2 from 8: 8x7 = 56." },
      { id: "pnc-h-3", questionText: "How many ways can the letters of the word 'BALLOON' be arranged?", options: ["1260", "2520", "5040", "630"], correctIndex: 0, explanation: "BALLOON has 7 letters with L and O each repeating twice: 7!/(2!x2!) = 5040/4 = 1260." },
      { id: "pnc-h-4", questionText: "In how many ways can 4 boys and 3 girls be seated in a row such that no two girls sit together?", options: ["1440", "720", "2880", "360"], correctIndex: 0, explanation: "Arrange boys first (4!=24), creating 5 gaps; place girls in 3 of them (P(5,3)=60). Total = 24x60 = 1440." },
      { id: "pnc-h-5", questionText: "How many ways can the letters of 'MISSISSIPPI' be arranged?", options: ["34650", "11550", "69300", "17325"], correctIndex: 0, explanation: "11 letters with I=4, S=4, P=2: 11!/(4!x4!x2!) = 34650." },
      { id: "pnc-h-6", questionText: "From 5 men and 4 women, in how many ways can a committee of 3 men and 2 women be formed?", options: ["60", "40", "80", "120"], correctIndex: 0, explanation: "C(5,3) x C(4,2) = 10 x 6 = 60." },
    ],
  },

  "Time & Work": {
    easy: [
      { id: "tw-e-1", questionText: "A can finish a work in 10 days. What fraction of the work does A complete in 1 day?", options: ["1/10", "1/5", "10", "1"], correctIndex: 0, explanation: "If the whole work takes 10 days, 1 day's work = 1/10." },
      { id: "tw-e-2", questionText: "If A can do a job in 5 days, how many days will A take to do 2 such jobs?", options: ["10", "5", "15", "20"], correctIndex: 0, explanation: "Twice the work at the same rate takes twice the time: 5x2 = 10 days." },
      { id: "tw-e-3", questionText: "A works twice as fast as B. If B takes 12 days to finish a task, how many days does A take?", options: ["6", "12", "24", "3"], correctIndex: 0, explanation: "Twice as fast means half the time: 12/2 = 6 days." },
      { id: "tw-e-4", questionText: "If A can paint a wall in 6 days, what fraction does A paint in 2 days?", options: ["1/3", "1/2", "1/6", "2/3"], correctIndex: 0, explanation: "2 days out of 6 = 2/6 = 1/3 of the work." },
      { id: "tw-e-5", questionText: "B can do a job in 8 days. How long does B take to do half the job?", options: ["4", "2", "6", "8"], correctIndex: 0, explanation: "Half the work takes half the time: 8/2 = 4 days." },
      { id: "tw-e-6", questionText: "A is thrice as fast as B. If B takes 15 days, how many days does A take?", options: ["5", "15", "45", "3"], correctIndex: 0, explanation: "Three times as fast means one-third the time: 15/3 = 5 days." },
      { id: "tw-e-7", questionText: "A can finish a task in 9 days. What part of the work is left after 3 days?", options: ["2/3", "1/3", "1/2", "3/4"], correctIndex: 0, explanation: "Done = 3/9 = 1/3, so remaining = 2/3." },
    ],
    medium: [
      { id: "tw-m-1", questionText: "A can complete a work in 8 days and B in 12 days. Working together, how many days will they take?", options: ["4.8", "6", "5", "4"], correctIndex: 0, explanation: "Combined rate = 1/8+1/12 = 5/24 per day. Days = 24/5 = 4.8." },
      { id: "tw-m-2", questionText: "A and B together can do a work in 6 days. A alone can do it in 10 days. In how many days can B alone do it?", options: ["15", "12", "20", "18"], correctIndex: 0, explanation: "B's rate = 1/6 - 1/10 = 1/15 per day, so B alone takes 15 days." },
      { id: "tw-m-3", questionText: "12 men can complete a work in 18 days. How many men are needed to complete it in 9 days?", options: ["24", "18", "20", "16"], correctIndex: 0, explanation: "Men x Days is constant: 12x18 = 216. 216/9 = 24 men." },
      { id: "tw-m-4", questionText: "A can do a work in 20 days and B in 30 days. They work together for 5 days. What fraction of the work is completed?", options: ["5/12", "1/2", "1/3", "2/5"], correctIndex: 0, explanation: "Combined rate = 1/20+1/30 = 1/12 per day. In 5 days: 5/12." },
      { id: "tw-m-5", questionText: "15 workers can complete a wall in 12 days. How many workers are needed to complete it in 9 days?", options: ["20", "18", "15", "25"], correctIndex: 0, explanation: "Workers x Days constant: 15x12=180. 180/9 = 20 workers." },
      { id: "tw-m-6", questionText: "A and B can together finish a job in 12 days. A alone takes 20 days. Find B's time alone.", options: ["30", "24", "36", "40"], correctIndex: 0, explanation: "B's rate = 1/12 - 1/20 = 1/30 per day, so B takes 30 days alone." },
      { id: "tw-m-7", questionText: "A works for 4 days on a task he can finish alone in 12 days, then leaves. B finishes the remaining work in 6 days. In how many days can B alone do the whole work?", options: ["9", "12", "6", "18"], correctIndex: 0, explanation: "A completed 4/12=1/3; remaining 2/3 done by B in 6 days, so B's full-work time = 6/(2/3) = 9 days." },
    ],
    hard: [
      { id: "tw-h-1", questionText: "A can do a work in 15 days, B in 20 days. They work together for 4 days, then A leaves. In how many more days will B finish the remaining work?", options: ["32/3 days", "10 days", "12 days", "8 days"], correctIndex: 0, explanation: "Combined rate = 7/60 per day; in 4 days they finish 28/60. Remaining 32/60 done by B alone at 1/20 per day = 32/3 days." },
      { id: "tw-h-2", questionText: "A, B and C can complete a work in 10, 15 and 30 days respectively. If all work together, in how many days will the work be completed?", options: ["5", "6", "10", "15"], correctIndex: 0, explanation: "Combined rate = 1/10+1/15+1/30 = 6/30 = 1/5 per day, so 5 days." },
      { id: "tw-h-3", questionText: "A pipe can fill a tank in 6 hours. Due to a leak, it takes 8 hours to fill. In how many hours can the leak alone empty the full tank?", options: ["24", "20", "18", "30"], correctIndex: 0, explanation: "Fill rate 1/6, combined rate 1/8. Leak rate = 1/6-1/8 = 1/24 per hour, so the leak alone empties it in 24 hours." },
      { id: "tw-h-4", questionText: "A, B and C together can complete a work in 6 days. A and B together can do it in 10 days. Find C's time alone.", options: ["15", "12", "20", "10"], correctIndex: 0, explanation: "C's rate = 1/6 - 1/10 = 1/15 per day, so C alone takes 15 days." },
      { id: "tw-h-5", questionText: "Two pipes A and B can fill a tank in 12 and 18 minutes respectively. Both are opened together, but A is closed after 4 minutes. Find the total time to fill the tank.", options: ["12 minutes", "10 minutes", "14 minutes", "9 minutes"], correctIndex: 0, explanation: "Combined rate = 5/36/min; in 4 min, 5/9 is done. Remaining 4/9 by B alone (1/18/min) takes 8 min. Total = 4+8 = 12 minutes." },
      { id: "tw-h-6", questionText: "A can do a piece of work in 18 days. B is 50% more efficient than A. Find the time B alone takes.", options: ["12", "9", "15", "10"], correctIndex: 0, explanation: "B's rate = 1.5 x (1/18) = 1/12 per day, so B takes 12 days." },
    ],
  },

  "Speed & Distance": {
    easy: [
      { id: "sd-e-1", questionText: "A car travels 100 km in 2 hours. What is its speed?", options: ["50 km/h", "100 km/h", "25 km/h", "75 km/h"], correctIndex: 0, explanation: "Speed = Distance/Time = 100/2 = 50 km/h." },
      { id: "sd-e-2", questionText: "If speed is 60 km/h, how far does it travel in 30 minutes?", options: ["30 km", "60 km", "15 km", "45 km"], correctIndex: 0, explanation: "30 minutes is half an hour, so distance = 60 x 0.5 = 30 km." },
      { id: "sd-e-3", questionText: "Convert 36 km/h into m/s.", options: ["10 m/s", "36 m/s", "6 m/s", "18 m/s"], correctIndex: 0, explanation: "Multiply by 5/18: 36 x 5/18 = 10 m/s." },
      { id: "sd-e-4", questionText: "A cyclist covers 45 km in 3 hours. Find the speed.", options: ["15 km/h", "20 km/h", "10 km/h", "25 km/h"], correctIndex: 0, explanation: "45/3 = 15 km/h." },
      { id: "sd-e-5", questionText: "Convert 20 m/s into km/h.", options: ["72 km/h", "60 km/h", "50 km/h", "80 km/h"], correctIndex: 0, explanation: "Multiply by 18/5: 20 x 18/5 = 72 km/h." },
      { id: "sd-e-6", questionText: "A person walks at 5 km/h. How long does it take to cover 15 km?", options: ["3 hours", "2 hours", "4 hours", "5 hours"], correctIndex: 0, explanation: "15/5 = 3 hours." },
      { id: "sd-e-7", questionText: "A bus travels 240 km in 4 hours. Find its speed.", options: ["60 km/h", "50 km/h", "70 km/h", "40 km/h"], correctIndex: 0, explanation: "240/4 = 60 km/h." },
    ],
    medium: [
      { id: "sd-m-1", questionText: "A man covers a distance in 5 hours at 40 km/h. If he travels at 50 km/h, how long will he take?", options: ["4 hours", "5 hours", "3.5 hours", "4.5 hours"], correctIndex: 0, explanation: "Distance = 40x5 = 200 km. Time at 50 km/h = 200/50 = 4 hours." },
      { id: "sd-m-2", questionText: "Two trains start from the same point in opposite directions at 50 km/h and 70 km/h. After how many hours will they be 600 km apart?", options: ["5 hours", "4 hours", "6 hours", "10 hours"], correctIndex: 0, explanation: "Relative speed = 120 km/h. Time = 600/120 = 5 hours." },
      { id: "sd-m-3", questionText: "A boat goes 24 km downstream in 4 hours and returns in 6 hours. Find the speed of the boat in still water.", options: ["5 km/h", "6 km/h", "4 km/h", "10 km/h"], correctIndex: 0, explanation: "Downstream speed = 6 km/h, upstream = 4 km/h. Boat speed = (6+4)/2 = 5 km/h." },
      { id: "sd-m-4", questionText: "A car travels at 80 km/h for 2.5 hours. How far does it travel?", options: ["200 km", "180 km", "220 km", "160 km"], correctIndex: 0, explanation: "80 x 2.5 = 200 km." },
      { id: "sd-m-5", questionText: "Two cyclists start from the same point, one going north at 12 km/h and the other east at 16 km/h. After 1 hour, how far apart are they (straight-line)?", options: ["20 km", "18 km", "28 km", "24 km"], correctIndex: 0, explanation: "Using Pythagoras: sqrt(12^2+16^2) = sqrt(400) = 20 km." },
      { id: "sd-m-6", questionText: "A man walks at 4 km/h to cover a distance and returns at 6 km/h. If total time is 5 hours, find the one-way distance.", options: ["12 km", "10 km", "15 km", "18 km"], correctIndex: 0, explanation: "d/4 + d/6 = 5 gives 5d/12 = 5, so d = 12 km." },
      { id: "sd-m-7", questionText: "A train 200m long passes a pole in 10 seconds. Find its speed in km/h.", options: ["72 km/h", "60 km/h", "80 km/h", "65 km/h"], correctIndex: 0, explanation: "Speed = 200/10 = 20 m/s = 72 km/h." },
    ],
    hard: [
      { id: "sd-h-1", questionText: "A train 150m long crosses a platform 250m long in 20 seconds. Find the speed of the train in km/h.", options: ["72 km/h", "60 km/h", "80 km/h", "65 km/h"], correctIndex: 0, explanation: "Total distance = 400m in 20s = 20 m/s = 20x18/5 = 72 km/h." },
      { id: "sd-h-2", questionText: "Two trains of equal length 120m each run in the same direction at 54 km/h and 36 km/h. Find the time taken by the faster train to cross the slower one.", options: ["48 seconds", "40 seconds", "36 seconds", "60 seconds"], correctIndex: 0, explanation: "Relative speed = 18 km/h = 5 m/s. Total length to cover = 240m. Time = 240/5 = 48s." },
      { id: "sd-h-3", questionText: "A man rows 30 km upstream in 6 hours and 30 km downstream in 3 hours. Find the speed of the stream.", options: ["2.5 km/h", "5 km/h", "7.5 km/h", "2 km/h"], correctIndex: 0, explanation: "Upstream speed = 5 km/h, downstream = 10 km/h. Stream speed = (10-5)/2 = 2.5 km/h." },
      { id: "sd-h-4", questionText: "A and B start from the same point and walk in opposite directions at 5 km/h and 7 km/h. After how much time will they be 36 km apart?", options: ["3 hours", "2 hours", "4 hours", "6 hours"], correctIndex: 0, explanation: "Relative speed = 12 km/h. Time = 36/12 = 3 hours." },
      { id: "sd-h-5", questionText: "A boat's speed in still water is 10 km/h. It travels 30 km downstream and returns, taking a total of 6.4 hours. Find the speed of the stream.", options: ["2.5 km/h", "2 km/h", "3 km/h", "1.5 km/h"], correctIndex: 0, explanation: "Solving 30/(10+x) + 30/(10-x) = 6.4 gives x = 2.5 km/h." },
      { id: "sd-h-6", questionText: "A train running at 90 km/h crosses a platform in 30 seconds and crosses a man standing on the platform in 12 seconds. Find the length of the platform.", options: ["450 m", "500 m", "400 m", "350 m"], correctIndex: 0, explanation: "Speed=25 m/s. Train length=25x12=300m. Platform crossing distance=25x30=750m. Platform=750-300=450m." },
    ],
  },

  "Profit & Loss": {
    easy: [
      { id: "pl-e-1", questionText: "An item bought for Rs.200 is sold for Rs.250. Find the profit percentage.", options: ["25%", "20%", "30%", "50%"], correctIndex: 0, explanation: "Profit = Rs.50. Profit% = 50/200 x 100 = 25%." },
      { id: "pl-e-2", questionText: "An item is sold at a loss of 10% for Rs.180. Find its cost price.", options: ["Rs.200", "Rs.190", "Rs.198", "Rs.210"], correctIndex: 0, explanation: "CP x 0.9 = 180, so CP = 180/0.9 = Rs.200." },
      { id: "pl-e-3", questionText: "If CP = Rs.500 and SP = Rs.450, find the loss percentage.", options: ["10%", "5%", "15%", "20%"], correctIndex: 0, explanation: "Loss = Rs.50. Loss% = 50/500 x 100 = 10%." },
      { id: "pl-e-4", questionText: "An article bought for Rs.150 is sold for Rs.180. Find the profit.", options: ["Rs.30", "Rs.25", "Rs.35", "Rs.40"], correctIndex: 0, explanation: "180 - 150 = Rs.30 profit." },
      { id: "pl-e-5", questionText: "A man sells an article at a loss of Rs.20, which is 10% of the cost price. Find the cost price.", options: ["Rs.200", "Rs.180", "Rs.220", "Rs.250"], correctIndex: 0, explanation: "10% of CP = 20, so CP = Rs.200." },
      { id: "pl-e-6", questionText: "If CP = Rs.80 and profit % = 25%, find the selling price.", options: ["Rs.100", "Rs.105", "Rs.95", "Rs.90"], correctIndex: 0, explanation: "SP = CP x 1.25 = 80 x 1.25 = Rs.100." },
      { id: "pl-e-7", questionText: "An item marked at Rs.500 is sold at a 10% discount. Find the selling price.", options: ["Rs.450", "Rs.480", "Rs.470", "Rs.460"], correctIndex: 0, explanation: "500 x 0.9 = Rs.450." },
    ],
    medium: [
      { id: "pl-m-1", questionText: "A shopkeeper marks an item 20% above cost price and gives a 10% discount. Find his profit %.", options: ["8%", "10%", "12%", "20%"], correctIndex: 0, explanation: "Let CP=100. MP=120, SP=120x0.9=108. Profit = 8%." },
      { id: "pl-m-2", questionText: "By selling 12 pens for Rs.100, a man loses 20%. How many pens should he sell for Rs.100 to gain 20%?", options: ["8", "10", "6", "9"], correctIndex: 0, explanation: "CP of 12 pens = 100/0.8 = 125. For 20% gain, the math works out to selling 8 pens for Rs.100." },
      { id: "pl-m-3", questionText: "A trader buys goods at a 20% discount on the marked price and sells at the marked price. Find his profit %.", options: ["25%", "20%", "15%", "30%"], correctIndex: 0, explanation: "Let MP=100, CP=80, SP=100. Profit% = 20/80 x 100 = 25%." },
      { id: "pl-m-4", questionText: "A man buys an item for Rs.600 and sells it at a 15% profit. Find the selling price.", options: ["Rs.690", "Rs.660", "Rs.700", "Rs.650"], correctIndex: 0, explanation: "600 x 1.15 = Rs.690." },
      { id: "pl-m-5", questionText: "An article's marked price is Rs.1000. After a discount, it sells for Rs.850. Find the discount %.", options: ["15%", "10%", "20%", "12%"], correctIndex: 0, explanation: "Discount = Rs.150. 150/1000 x 100 = 15%." },
      { id: "pl-m-6", questionText: "A shopkeeper buys 20 pens for Rs.200 and sells them at Rs.12 each. Find the profit %.", options: ["20%", "15%", "25%", "10%"], correctIndex: 0, explanation: "CP/pen=Rs.10, SP=Rs.12, profit=Rs.2. 2/10 x 100 = 20%." },
      { id: "pl-m-7", questionText: "A trader marks goods 40% above cost and allows a discount of 10%. Find his profit %.", options: ["26%", "30%", "24%", "20%"], correctIndex: 0, explanation: "CP=100, MP=140, SP=140x0.9=126. Profit = 26%." },
    ],
    hard: [
      { id: "pl-h-1", questionText: "A man sells two items at Rs.990 each. On one he gains 10% and on the other he loses 10%. Find his overall profit or loss %.", options: ["1% loss", "1% profit", "No profit no loss", "2% loss"], correctIndex: 0, explanation: "CP1=900, CP2=1100, total CP=2000, total SP=1980. Loss=20, which is 1% of 2000." },
      { id: "pl-h-2", questionText: "A dishonest dealer professes to sell at cost price but uses a weight of 900gm for 1kg. Find his profit %.", options: ["11.11%", "10%", "9%", "12%"], correctIndex: 0, explanation: "Profit% = (1000-900)/900 x 100 = 100/9 ~ 11.11%." },
      { id: "pl-h-3", questionText: "A shopkeeper allows a 25% discount on the marked price but still makes a 20% profit. If the cost price is Rs.480, find the marked price.", options: ["Rs.768", "Rs.720", "Rs.800", "Rs.750"], correctIndex: 0, explanation: "SP = 480x1.2 = 576. MPx0.75=576, so MP = 576/0.75 = Rs.768." },
      { id: "pl-h-4", questionText: "A man sold an article at a loss of 15%. Had he sold it for Rs.42 more, he would have gained 6%. Find the cost price.", options: ["Rs.200", "Rs.210", "Rs.190", "Rs.220"], correctIndex: 0, explanation: "1.06x - 0.85x = 42 gives 0.21x=42, so x = Rs.200." },
      { id: "pl-h-5", questionText: "A retailer buys a radio for Rs.225 with overhead expenses of Rs.15. If he sells it for Rs.300, find his profit %.", options: ["25%", "20%", "30%", "22%"], correctIndex: 0, explanation: "Total CP = 240. Profit = 60. 60/240 x 100 = 25%." },
      { id: "pl-h-6", questionText: "By selling 45 lemons for Rs.40, a man loses 20%. How many lemons should he sell for Rs.24 to gain 20%?", options: ["18", "20", "15", "24"], correctIndex: 0, explanation: "CP of 45 lemons = 40/0.8 = 50. For Rs.24 at 20% gain, required CP = 24/1.2 = 20; lemons = 20/(50/45) = 18." },
    ],
  },

  "Percentages": {
    easy: [
      { id: "pct-e-1", questionText: "What is 25% of 80?", options: ["20", "25", "15", "30"], correctIndex: 0, explanation: "25% of 80 = 0.25 x 80 = 20." },
      { id: "pct-e-2", questionText: "If 40% of a number is 60, find the number.", options: ["150", "120", "160", "140"], correctIndex: 0, explanation: "Number = 60/0.4 = 150." },
      { id: "pct-e-3", questionText: "Convert 3/4 into a percentage.", options: ["75%", "70%", "80%", "65%"], correctIndex: 0, explanation: "3/4 = 0.75 = 75%." },
      { id: "pct-e-4", questionText: "What is 50% of 250?", options: ["125", "100", "150", "120"], correctIndex: 0, explanation: "50% of 250 = 125." },
      { id: "pct-e-5", questionText: "If 20% of a number is 50, find the number.", options: ["250", "200", "300", "150"], correctIndex: 0, explanation: "Number = 50/0.2 = 250." },
      { id: "pct-e-6", questionText: "Convert 0.45 into a percentage.", options: ["45%", "4.5%", "450%", "0.45%"], correctIndex: 0, explanation: "0.45 = 45%." },
      { id: "pct-e-7", questionText: "What is 10% of 10% of 1000?", options: ["10", "100", "1", "1000"], correctIndex: 0, explanation: "10% of 1000=100; 10% of 100=10." },
    ],
    medium: [
      { id: "pct-m-1", questionText: "A number is increased by 20% and then decreased by 20%. Find the net % change.", options: ["-4%", "0%", "-2%", "-5%"], correctIndex: 0, explanation: "1.2 x 0.8 = 0.96, a net 4% decrease." },
      { id: "pct-m-2", questionText: "If the price of an item increases by 25%, by what % should consumption be reduced to keep expenditure the same?", options: ["20%", "25%", "15%", "30%"], correctIndex: 0, explanation: "Reduction% = 25/(100+25) x 100 = 20%." },
      { id: "pct-m-3", questionText: "In an election, a candidate got 60% of votes and won by 1200 votes. Find the total votes.", options: ["6000", "5000", "7200", "6500"], correctIndex: 0, explanation: "Winning margin = 20% of total = 1200, so total = 1200/0.2 = 6000." },
      { id: "pct-m-4", questionText: "A number when increased by 15% becomes 230. Find the original number.", options: ["200", "210", "195", "220"], correctIndex: 0, explanation: "x x 1.15 = 230, so x = 200." },
      { id: "pct-m-5", questionText: "In a test, a student scored 72 out of 90. Find the percentage.", options: ["80%", "75%", "85%", "78%"], correctIndex: 0, explanation: "72/90 x 100 = 80%." },
      { id: "pct-m-6", questionText: "If the price of sugar falls by 20%, by what % can consumption increase to keep expenditure the same?", options: ["25%", "20%", "30%", "15%"], correctIndex: 0, explanation: "Increase% = 20/(100-20) x 100 = 25%." },
      { id: "pct-m-7", questionText: "60% of students in a school are boys. If there are 360 girls, find the total number of students.", options: ["900", "800", "950", "850"], correctIndex: 0, explanation: "Girls are 40% of total: 360/0.4 = 900." },
    ],
    hard: [
      { id: "pct-h-1", questionText: "A's salary is 20% more than B's. By what % is B's salary less than A's?", options: ["16.67%", "20%", "15%", "25%"], correctIndex: 0, explanation: "Let B=100, A=120. B is less than A by 20/120 x 100 ~ 16.67%." },
      { id: "pct-h-2", questionText: "In a school, 40% of students are girls. If there are 180 boys, find the total number of students.", options: ["300", "280", "320", "250"], correctIndex: 0, explanation: "Boys are 60% of total, so total = 180/0.6 = 300." },
      { id: "pct-h-3", questionText: "The population of a town increases by 10% in the first year and decreases by 10% in the second year. If the original population was 20,000, find the population after 2 years.", options: ["19,800", "20,000", "19,000", "20,200"], correctIndex: 0, explanation: "20000 x 1.1 x 0.9 = 19,800." },
      { id: "pct-h-4", questionText: "A's income is 25% more than B's. By what percentage is B's income less than A's?", options: ["20%", "25%", "16.67%", "22%"], correctIndex: 0, explanation: "B=100, A=125. B is less by (125-100)/125 x 100 = 20%." },
      { id: "pct-h-5", questionText: "In an exam, 35% failed in Maths, 45% failed in English, and 20% failed in both. Find the % who passed in both subjects.", options: ["40%", "30%", "45%", "50%"], correctIndex: 0, explanation: "Failed at least one = 35+45-20 = 60%. Passed both = 100-60 = 40%." },
      { id: "pct-h-6", questionText: "A number is first increased by 25% and then decreased by 20%. Find the net % change.", options: ["No change (0%)", "5% increase", "5% decrease", "10% increase"], correctIndex: 0, explanation: "1.25 x 0.8 = 1.0, meaning no net change." },
    ],
  },

  "Number System": {
    easy: [
      { id: "ns-e-1", questionText: "Which of the following is a prime number?", options: ["17", "21", "27", "33"], correctIndex: 0, explanation: "17 has no divisors other than 1 and itself, making it prime; the others are all divisible by smaller numbers." },
      { id: "ns-e-2", questionText: "What is the sum of the first 5 natural numbers?", options: ["15", "10", "20", "25"], correctIndex: 0, explanation: "1+2+3+4+5 = 15." },
      { id: "ns-e-3", questionText: "Find the smallest 3-digit number divisible by 5.", options: ["100", "105", "95", "110"], correctIndex: 0, explanation: "100 is the smallest 3-digit number and is exactly divisible by 5." },
      { id: "ns-e-4", questionText: "Which of the following is an even number?", options: ["34", "21", "57", "89"], correctIndex: 0, explanation: "34 is divisible by 2; the others are odd." },
      { id: "ns-e-5", questionText: "What is the place value of 6 in 4639?", options: ["600", "6", "60", "6000"], correctIndex: 0, explanation: "The digit 6 is in the hundreds place, giving a place value of 600." },
      { id: "ns-e-6", questionText: "Find the successor of 999.", options: ["1000", "998", "1001", "990"], correctIndex: 0, explanation: "The successor of 999 is 1000." },
      { id: "ns-e-7", questionText: "How many even numbers are there between 1 and 20?", options: ["10", "9", "11", "8"], correctIndex: 0, explanation: "2,4,6,...,20 gives 10 even numbers." },
    ],
    medium: [
      { id: "ns-m-1", questionText: "What is the HCF of 18 and 24?", options: ["6", "12", "9", "3"], correctIndex: 0, explanation: "The highest common factor of 18 (2x3^2) and 24 (2^3x3) is 2x3 = 6." },
      { id: "ns-m-2", questionText: "What is the LCM of 4, 6 and 8?", options: ["24", "12", "48", "36"], correctIndex: 0, explanation: "The smallest number divisible by 4, 6, and 8 is 24." },
      { id: "ns-m-3", questionText: "How many factors does 36 have?", options: ["9", "6", "8", "12"], correctIndex: 0, explanation: "36 = 2^2x3^2, so factor count = (2+1)(2+1) = 9." },
      { id: "ns-m-4", questionText: "What is the LCM of 12 and 18?", options: ["36", "24", "72", "18"], correctIndex: 0, explanation: "12=2^2x3, 18=2x3^2. LCM = 2^2x3^2 = 36." },
      { id: "ns-m-5", questionText: "Find the HCF of 36, 60, and 84.", options: ["12", "6", "18", "24"], correctIndex: 0, explanation: "The highest common factor shared by all three numbers is 12." },
      { id: "ns-m-6", questionText: "What is the sum of the digits of 987654?", options: ["39", "36", "42", "45"], correctIndex: 0, explanation: "9+8+7+6+5+4 = 39." },
      { id: "ns-m-7", questionText: "Which of these numbers is divisible by 11?", options: ["121", "123", "125", "127"], correctIndex: 0, explanation: "121 = 11 x 11, exactly divisible by 11." },
    ],
    hard: [
      { id: "ns-h-1", questionText: "Find the remainder when 2^100 is divided by 7.", options: ["2", "1", "4", "6"], correctIndex: 0, explanation: "2^3 is congruent to 1 mod 7, and 100 mod 3 = 1, so 2^100 is congruent to 2^1 = 2 (mod 7)." },
      { id: "ns-h-2", questionText: "What is the unit digit of 7^45?", options: ["7", "9", "3", "1"], correctIndex: 0, explanation: "Unit digits of powers of 7 cycle as 7,9,3,1. 45 mod 4 = 1, so the unit digit is 7." },
      { id: "ns-h-3", questionText: "If a number is divisible by both 8 and 12, what is the smallest such number greater than 0?", options: ["24", "48", "16", "36"], correctIndex: 0, explanation: "LCM(8,12) = 24, the smallest number divisible by both." },
      { id: "ns-h-4", questionText: "Find the remainder when 17^23 is divided by 18.", options: ["17", "1", "16", "0"], correctIndex: 0, explanation: "17 is congruent to -1 mod 18, so 17^23 is congruent to (-1)^23 = -1, which is 17 mod 18." },
      { id: "ns-h-5", questionText: "How many trailing zeros are there in 100! (100 factorial)?", options: ["24", "20", "25", "22"], correctIndex: 0, explanation: "Count of factor 5s: floor(100/5)+floor(100/25) = 20+4 = 24." },
      { id: "ns-h-6", questionText: "Find the smallest number which, when divided by 4, 6, and 8, leaves remainder 2 in each case.", options: ["26", "24", "28", "22"], correctIndex: 0, explanation: "LCM(4,6,8) = 24, so the smallest such number is 24+2 = 26." },
    ],
  },

  "Calendar": {
    easy: [
      { id: "cal-e-1", questionText: "If today is Monday, what day will it be after 8 days?", options: ["Tuesday", "Monday", "Wednesday", "Sunday"], correctIndex: 0, explanation: "8 mod 7 = 1, so it's 1 day after Monday: Tuesday." },
      { id: "cal-e-2", questionText: "How many days are there in a leap year?", options: ["366", "365", "364", "367"], correctIndex: 0, explanation: "A leap year has an extra day in February, totaling 366 days." },
      { id: "cal-e-3", questionText: "If 1st January is a Sunday, what day is 8th January?", options: ["Sunday", "Monday", "Saturday", "Friday"], correctIndex: 0, explanation: "8th is exactly 7 days after 1st, so it falls on the same weekday: Sunday." },
      { id: "cal-e-4", questionText: "If today is Thursday, what day was it 3 days ago?", options: ["Monday", "Tuesday", "Sunday", "Wednesday"], correctIndex: 0, explanation: "Thursday minus 3 days is Monday." },
      { id: "cal-e-5", questionText: "How many months in a year have 31 days?", options: ["7", "6", "8", "5"], correctIndex: 0, explanation: "January, March, May, July, August, October, and December have 31 days - 7 months." },
      { id: "cal-e-6", questionText: "If a week starts on Sunday, what is the 5th day of the week?", options: ["Thursday", "Wednesday", "Friday", "Saturday"], correctIndex: 0, explanation: "Sunday(1), Monday(2), Tuesday(3), Wednesday(4), Thursday(5)." },
      { id: "cal-e-7", questionText: "How many days are there in February in a non-leap year?", options: ["28", "29", "30", "31"], correctIndex: 0, explanation: "February has 28 days in a non-leap year." },
    ],
    medium: [
      { id: "cal-m-1", questionText: "If today is Wednesday, what day will it be after 17 days?", options: ["Saturday", "Friday", "Sunday", "Thursday"], correctIndex: 0, explanation: "17 mod 7 = 3. Wednesday + 3 days = Saturday." },
      { id: "cal-m-2", questionText: "What was the day of the week on 1st January 2000?", options: ["Saturday", "Sunday", "Friday", "Monday"], correctIndex: 0, explanation: "This is a well-documented historical fact: 1 January 2000 fell on a Saturday." },
      { id: "cal-m-3", questionText: "If a month begins on a Friday, how many Fridays will it have if it has 31 days?", options: ["5", "4", "6", "3"], correctIndex: 0, explanation: "Fridays fall on days 1, 8, 15, 22, and 29 - that's 5 Fridays." },
      { id: "cal-m-4", questionText: "If today is Sunday, what day will it be after 100 days?", options: ["Tuesday", "Monday", "Wednesday", "Thursday"], correctIndex: 0, explanation: "100 mod 7 = 2. Sunday + 2 days = Tuesday." },
      { id: "cal-m-5", questionText: "If 1st March is a Monday, what day is 1st April of the same (non-leap) year?", options: ["Thursday", "Wednesday", "Friday", "Tuesday"], correctIndex: 0, explanation: "March has 31 days; 31 mod 7 = 3. Monday + 3 = Thursday." },
      { id: "cal-m-6", questionText: "How many odd days are there in 100 years?", options: ["5", "4", "6", "3"], correctIndex: 0, explanation: "A well-known calendar result: 100 years contain 5 odd days." },
      { id: "cal-m-7", questionText: "If 1st January of a non-leap year is a Tuesday, what day is 1st January of the next year?", options: ["Wednesday", "Thursday", "Tuesday", "Monday"], correctIndex: 0, explanation: "365 mod 7 = 1, so the next year starts 1 day later: Wednesday." },
    ],
    hard: [
      { id: "cal-h-1", questionText: "What was the day of the week on 26th January 1950 (when the Indian Constitution came into effect)?", options: ["Thursday", "Wednesday", "Friday", "Tuesday"], correctIndex: 0, explanation: "This is a well-documented historical fact: 26 January 1950 was a Thursday." },
      { id: "cal-h-2", questionText: "How many odd days does a leap year contribute (for calendar day-of-week calculations)?", options: ["2", "1", "3", "0"], correctIndex: 0, explanation: "A leap year has 366 days = 52 weeks + 2 days, so it contributes 2 odd days." },
      { id: "cal-h-3", questionText: "If 15th August 1947 was a Friday, what day was 15th August 1948?", options: ["Sunday", "Saturday", "Monday", "Friday"], correctIndex: 0, explanation: "1948 is a leap year and the span includes 29 Feb 1948, making it 366 days = 2 odd days. Friday + 2 = Sunday." },
      { id: "cal-h-4", questionText: "If 1st January 2024 was a Monday (2024 is a leap year), what day is 1st January 2025?", options: ["Wednesday", "Tuesday", "Thursday", "Friday"], correctIndex: 0, explanation: "2024 has 366 days = 2 odd days. Monday + 2 = Wednesday." },
      { id: "cal-h-5", questionText: "If the first day of a leap year is Monday, what day is the last day (31st December) of that year?", options: ["Tuesday", "Monday", "Wednesday", "Sunday"], correctIndex: 0, explanation: "Day 366 = day 1 + 365 days. 365 mod 7 = 1, so Monday + 1 = Tuesday." },
      { id: "cal-h-6", questionText: "If 1st January 2000 was a Saturday, what day was 1st January 2001?", options: ["Monday", "Sunday", "Tuesday", "Wednesday"], correctIndex: 0, explanation: "2000 is a leap year (366 days = 2 odd days). Saturday + 2 = Monday." },
    ],
  },

  "Clock": {
    easy: [
      { id: "clk-e-1", questionText: "How many degrees does the minute hand move in 1 minute?", options: ["6 degrees", "3 degrees", "12 degrees", "1 degree"], correctIndex: 0, explanation: "The minute hand covers 360 degrees in 60 minutes, so 360/60 = 6 degrees per minute." },
      { id: "clk-e-2", questionText: "How many degrees does the hour hand move in 1 hour?", options: ["30 degrees", "15 degrees", "6 degrees", "45 degrees"], correctIndex: 0, explanation: "The hour hand covers 360 degrees in 12 hours, so 360/12 = 30 degrees per hour." },
      { id: "clk-e-3", questionText: "At what time between 2 and 3 o'clock will the hands of a clock be together (approximately)?", options: ["Approximately 2:11", "Exactly 2:30", "Exactly 2:00", "Approximately 2:45"], correctIndex: 0, explanation: "Using the standard formula, the hands coincide at about 2 hours 10.9 minutes, approximately 2:11." },
      { id: "clk-e-4", questionText: "How many minutes does the minute hand take to complete one full round of the clock?", options: ["60", "30", "45", "90"], correctIndex: 0, explanation: "The minute hand completes a full circle every 60 minutes." },
      { id: "clk-e-5", questionText: "At 6:00, what is the angle between the hour and minute hand?", options: ["180 degrees", "90 degrees", "150 degrees", "120 degrees"], correctIndex: 0, explanation: "At 6:00 the hands point in exactly opposite directions, 180 degrees apart." },
      { id: "clk-e-6", questionText: "How many hours does the hour hand take to complete one full round of the clock?", options: ["12", "24", "6", "1"], correctIndex: 0, explanation: "The hour hand completes a full circle every 12 hours." },
      { id: "clk-e-7", questionText: "At 9:00, what is the angle between the hands?", options: ["90 degrees", "270 degrees", "180 degrees", "45 degrees"], correctIndex: 0, explanation: "At 9:00 the hour hand is at 270 degrees and minute hand at 0; the smaller angle between them is 90 degrees." },
    ],
    medium: [
      { id: "clk-m-1", questionText: "What is the angle between the hour and minute hands at 3:00?", options: ["90 degrees", "60 degrees", "75 degrees", "120 degrees"], correctIndex: 0, explanation: "At 3:00, the hour hand is at 90 degrees and minute hand at 0 degrees, giving a 90 degree angle." },
      { id: "clk-m-2", questionText: "What is the angle between the hour and minute hands at 4:30?", options: ["45 degrees", "30 degrees", "60 degrees", "15 degrees"], correctIndex: 0, explanation: "Hour hand at 4:30 = 135 degrees, minute hand at 30 min = 180 degrees. Difference = 45 degrees." },
      { id: "clk-m-3", questionText: "How many times do the hands of a clock overlap in 24 hours?", options: ["22", "24", "12", "20"], correctIndex: 0, explanation: "The hands overlap 11 times every 12 hours, so 22 times in 24 hours." },
      { id: "clk-m-4", questionText: "What is the angle between the hands at 7:00?", options: ["150 degrees", "120 degrees", "180 degrees", "90 degrees"], correctIndex: 0, explanation: "Hour hand at 210 degrees, minute hand at 0. The smaller angle is 360-210 = 150 degrees." },
      { id: "clk-m-5", questionText: "How many times in 12 hours do the hands of a clock coincide?", options: ["11", "12", "10", "22"], correctIndex: 0, explanation: "The hands coincide exactly 11 times every 12 hours." },
      { id: "clk-m-6", questionText: "At what time between 1 and 2 o'clock are the hands coincident (approximately)?", options: ["Approximately 1:05", "Exactly 1:30", "Exactly 1:00", "Approximately 1:15"], correctIndex: 0, explanation: "Using the standard formula, the hands coincide at about 1 hour 5.45 minutes." },
      { id: "clk-m-7", questionText: "What is the angle between the hour and minute hand at 10:30?", options: ["135 degrees", "120 degrees", "150 degrees", "105 degrees"], correctIndex: 0, explanation: "Hour hand at 315 degrees, minute hand at 180 degrees. Difference = 135 degrees." },
    ],
    hard: [
      { id: "clk-h-1", questionText: "How many times in a day are the hour and minute hands of a clock at a right angle (90 degrees)?", options: ["44", "22", "48", "24"], correctIndex: 0, explanation: "The hands form a right angle 22 times every 12 hours, so 44 times in 24 hours." },
      { id: "clk-h-2", questionText: "A clock is set right at 5 a.m. It loses 16 minutes in 24 hours. What will be the true time when the clock indicates 10 p.m. the same day?", options: ["Approximately 10:11 p.m.", "Exactly 10:00 p.m.", "Approximately 9:49 p.m.", "Approximately 10:30 p.m."], correctIndex: 0, explanation: "The clock shows 1424 minutes for every true 1440 minutes. Scaling the 17-hour elapsed clock time gives a true time of about 10:11 p.m." },
      { id: "clk-h-3", questionText: "At what time between 4 and 5 o'clock are the hands of a clock exactly opposite to each other (180 degrees)?", options: ["Approximately 4:54", "Exactly 4:30", "Approximately 4:45", "Exactly 5:00"], correctIndex: 0, explanation: "Using the standard formula for opposite hands, the hands are 180 degrees apart at approximately 4:54." },
      { id: "clk-h-4", questionText: "A clock gains 5 minutes every hour. If it's set correctly at 12:00 noon, what time will it show at the actual time of 6:00 pm the same day?", options: ["6:30 p.m.", "6:00 p.m.", "6:50 p.m.", "6:25 p.m."], correctIndex: 0, explanation: "6 real hours = 360 minutes; the clock runs at 65 min per 60 real min, showing 390 minutes = 6h30m elapsed, so it reads 6:30 p.m." },
      { id: "clk-h-5", questionText: "How many times in a day do the hands of a clock point in exactly opposite directions (180 degrees)?", options: ["22", "24", "11", "44"], correctIndex: 0, explanation: "The hands are exactly opposite 11 times every 12 hours, so 22 times in 24 hours." },
      { id: "clk-h-6", questionText: "How many minutes does it take for the minute hand to gain a full 360 degrees on the hour hand?", options: ["65 5/11 minutes", "60 minutes", "72 minutes", "55 minutes"], correctIndex: 0, explanation: "Relative speed = 5.5 degrees/min. Time to gain 360 degrees = 360/5.5 = 65 5/11 minutes - matching the well-known 'hands coincide every 65 5/11 minutes' result." },
    ],
  },

  "Puzzles": {
    easy: [
      { id: "puz-e-1", questionText: "Look at this series: 2, 4, 6, 8, ... What number comes next?", options: ["10", "12", "9", "11"], correctIndex: 0, explanation: "This is a simple series of even numbers increasing by 2, so next is 10." },
      { id: "puz-e-2", questionText: "Complete the series: A, C, E, G, ?", options: ["I", "H", "J", "F"], correctIndex: 0, explanation: "The series skips one letter each time, so the next letter is I." },
      { id: "puz-e-3", questionText: "If FRIEND is coded as GSJFOE (each letter shifted +1), how is CANDLE coded?", options: ["DBOEMF", "DBOEMG", "CBOEMF", "DCOEMF"], correctIndex: 0, explanation: "Shifting each letter by +1: C to D, A to B, N to O, D to E, L to M, E to F gives DBOEMF." },
      { id: "puz-e-4", questionText: "Complete the series: 3, 6, 9, 12, ?", options: ["15", "16", "14", "18"], correctIndex: 0, explanation: "The series increases by 3 each time, so next is 15." },
      { id: "puz-e-5", questionText: "Find the odd one: Dog, Cat, Cow, Table", options: ["Dog", "Cat", "Cow", "Table"], correctIndex: 3, explanation: "Table is furniture, not an animal." },
      { id: "puz-e-6", questionText: "If 5 oranges cost as much as 2 apples, and an apple costs Rs.20, find the cost of 1 orange.", options: ["Rs.8", "Rs.10", "Rs.5", "Rs.4"], correctIndex: 0, explanation: "2 apples = Rs.40 = cost of 5 oranges, so 1 orange = Rs.8." },
      { id: "puz-e-7", questionText: "Complete the analogy: Pen is to Write as Knife is to ?", options: ["Cut", "Eat", "Draw", "Paint"], correctIndex: 0, explanation: "A pen is used to write, just as a knife is used to cut." },
    ],
    medium: [
      { id: "puz-m-1", questionText: "Five people sit in a row in the order E, C, D, A, B from left to right. C is immediately left of D, who is third from the left, and E is at one end. Who is at the other end?", options: ["B", "A", "C", "E"], correctIndex: 0, explanation: "With D third and C immediately left of D, and E at the left end, A and B fill the remaining spots with B immediately right of A - so B sits at the other (right) end." },
      { id: "puz-m-2", questionText: "In a row of girls, Pooja is 9th from the left and 18th from the right. How many girls are in the row?", options: ["26", "27", "25", "24"], correctIndex: 0, explanation: "Total = (position from left) + (position from right) - 1 = 9 + 18 - 1 = 26." },
      { id: "puz-m-3", questionText: "Pointing to a man, a woman said, 'His mother is the only daughter of my mother.' How is the woman related to the man?", options: ["Mother", "Sister", "Aunt", "Grandmother"], correctIndex: 0, explanation: "'Only daughter of my mother' is the woman herself, so the man's mother is the woman - she is his mother." },
      { id: "puz-m-4", questionText: "If 'TEACHER' is coded as 'UFBDIFS' (each letter +1), how is 'STUDENT' coded?", options: ["TUVEFOU", "TUVEFOV", "SUVEFOU", "TUVDFOU"], correctIndex: 0, explanation: "Shifting each letter by +1: S to T, T to U, U to V, D to E, E to F, N to O, T to U gives TUVEFOU." },
      { id: "puz-m-5", questionText: "In a row of 40 students, Rohit is 15th from the left. What is his position from the right?", options: ["26", "25", "27", "24"], correctIndex: 0, explanation: "Position from right = total - position from left + 1 = 40 - 15 + 1 = 26." },
      { id: "puz-m-6", questionText: "P is the brother of Q. R is the father of P. S is the sister of R. How is S related to Q?", options: ["Aunt", "Sister", "Mother", "Cousin"], correctIndex: 0, explanation: "R is the father of both P and Q (siblings); S, being R's sister, is Q's paternal aunt." },
      { id: "puz-m-7", questionText: "Six friends sit in a row of 6 seats. D is immediately to the left of E, who sits at the right end (6th seat). C is 3rd from the left. What position does D occupy?", options: ["5th", "4th", "6th", "3rd"], correctIndex: 0, explanation: "E is at the 6th seat, and D being immediately to E's left places D at the 5th seat." },
    ],
    hard: [
      { id: "puz-h-1", questionText: "Five friends sit in a circle facing the center, in clockwise order Q, R, P, T, S. Who sits immediately clockwise of T?", options: ["S", "Q", "P", "R"], correctIndex: 0, explanation: "In the clockwise order Q, R, P, T, S, the person immediately clockwise of T is S." },
      { id: "puz-h-2", questionText: "A is the brother of B. B is the sister of C. C is the father of D. How is A related to D?", options: ["Uncle", "Father", "Grandfather", "Cousin"], correctIndex: 0, explanation: "A, B and C are siblings (A is male). Since C is D's father, A (C's brother) is D's uncle." },
      { id: "puz-h-3", questionText: "In a certain code, WATER is written as YCVGT (each letter shifted +2). How is FIRE written in the same code?", options: ["HKTG", "HKTF", "GKTG", "HKSG"], correctIndex: 0, explanation: "Shifting each letter by +2: F to H, I to K, R to T, E to G gives HKTG." },
      { id: "puz-h-4", questionText: "In a certain code, 'WATCH' is written as 'XCWGM' using an increasing shift (+1,+2,+3,+4,+5 per letter). How is 'CLOCK' written?", options: ["DNRGP", "DNRPG", "DMRGP", "DNQGP"], correctIndex: 0, explanation: "Applying shifts +1,+2,+3,+4,+5: C to D, L to N, O to R, C to G, K to P gives DNRGP." },
      { id: "puz-h-5", questionText: "Seven people sit in a row. M is 3rd from the left. N is 2nd from the right. There are exactly 2 people between M and N. How many people sit to the right of N?", options: ["1", "2", "3", "0"], correctIndex: 0, explanation: "N is 2nd from the right of 7, so exactly 1 person sits to N's right." },
      { id: "puz-h-6", questionText: "A is twice as old as B. Five years ago, A was three times as old as B was then. Find B's present age.", options: ["10", "15", "8", "12"], correctIndex: 0, explanation: "Let B=x, A=2x. Solving 2x-5 = 3(x-5) gives x = 10." },
    ],
  },
};

const CATEGORIES = Object.keys(bank);
const TOTAL_QUESTIONS_PER_SESSION = 25; // mandatory full assessment - matches a real placement test
const TOPIC_PRACTICE_QUESTIONS = 20; // per-topic independent practice test length
const TEST_DURATION_SECONDS = 30 * 60; // 30-minute countdown for the full test
const TOPIC_TEST_DURATION_SECONDS = 24 * 60; // ~1.2 min/question for a 20-question topic test

module.exports = {
  bank,
  CATEGORIES,
  TOTAL_QUESTIONS_PER_SESSION,
  TOPIC_PRACTICE_QUESTIONS,
  TEST_DURATION_SECONDS,
  TOPIC_TEST_DURATION_SECONDS,
};
