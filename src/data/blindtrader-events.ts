export type HeadlineDay = {
  day: number;
  dateLabel: string;
  headline: string;
  source: string;
};

export type StockEvent = {
  id: string;
  ticker: string;
  companyName: string;
  periodLabel: string;
  closes: number[]; // length 11
  priceSource: string;
  headlines: HeadlineDay[]; // length 10
  summary: string;
  /**
   * Company/product words that give away the company's identity when
   * they appear inside headline text (short name, ticker, product
   * names, etc.) — swapped for "[the company]" in headlines shown
   * during play via `redactHeadline` in lib/blindtrader.ts. The reveal
   * screen always shows the original text.
   */
  redactTerms: string[];
  /**
   * Real people's names tied to the company (CEOs, founders) — swapped
   * for "[an executive]" instead of "[the company]" so redacted
   * headlines don't read like "[the company] CEO [the company]".
   */
  redactNames: string[];
};

export const STOCK_EVENTS: StockEvent[] = [
  {
    id: "gme-jan-2021-squeeze",
    ticker: "GME",
    companyName: "GameStop Corp.",
    periodLabel: "January 14 – January 29, 2021",
    closes: [
      9.98, 8.88, 9.84, 9.78, 10.76, 16.25, 19.2, 37.0, 86.88, 48.4, 81.25,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for GME, Jan 14–29 2021 (split-adjusted for GameStop's later 4-for-1 stock split; close of $86.88 on Jan 27, 2021 is GameStop's recognized all-time-high close).",
    redactTerms: ["GameStop", "Gamestonk"],
    redactNames: [],
    headlines: [
      {
        day: 1,
        dateLabel: "January 15, 2021",
        headline:
          "GameStop shares keep climbing after the retailer adds three new board members tied to activist investor Ryan Cohen's RC Ventures, fueling turnaround hopes.",
        source: "Reuters, Jan 11 2021 (board news) / market reaction Jan 15",
      },
      {
        day: 2,
        dateLabel: "January 19, 2021",
        headline:
          "Short-seller Citron Research tweets that it will livestream '5 reasons' GameStop buyers are 'the suckers at this poker game,' predicting the stock falls back to $20.",
        source: "Citron Research (Andrew Left) via Twitter, Jan 19 2021",
      },
      {
        day: 3,
        dateLabel: "January 20, 2021",
        headline:
          "Citron's scheduled livestream debunking the GameStop rally is abruptly postponed, with the firm citing scheduling conflicts around Inauguration Day.",
        source: "Reporting on Citron Research livestream delay, Jan 20 2021",
      },
      {
        day: 4,
        dateLabel: "January 21, 2021",
        headline:
          "Citron's Andrew Left goes on Benzinga's 'Power Hour' to defend his short thesis instead of the promised livestream, as r/wallstreetbets piles on.",
        source: "Benzinga Power Hour interview, Jan 21 2021",
      },
      {
        day: 5,
        dateLabel: "January 22, 2021",
        headline:
          "GameStop jumps again as r/wallstreetbets declares victory over Citron; the Reddit forum's subscriber count explodes into the millions.",
        source: "Motley Fool / CNBC coverage, Jan 22 2021",
      },
      {
        day: 6,
        dateLabel: "January 25, 2021",
        headline:
          "Reports say hedge fund Melvin Capital has closed out its GameStop short position after Citadel and Point72 inject roughly $2.75 billion into the firm.",
        source: "Wall Street Journal / CNBC, Jan 25 2021",
      },
      {
        day: 7,
        dateLabel: "January 26, 2021",
        headline:
          "Elon Musk tweets simply 'Gamestonk!!' with a link to r/wallstreetbets, instantly amplifying the frenzy to a global audience.",
        source: "Elon Musk via Twitter, Jan 26 2021",
      },
      {
        day: 8,
        dateLabel: "January 27, 2021",
        headline:
          "GameStop closes at an all-time high as the short squeeze accelerates; several brokerages report extreme volatility and repeated trading halts.",
        source: "CNBC / Reuters market wrap, Jan 27 2021",
      },
      {
        day: 9,
        dateLabel: "January 28, 2021",
        headline:
          "Robinhood and other brokerages abruptly restrict buying of GameStop, AMC and other 'meme stocks,' triggering #DeleteRobinhood backlash and talk of a congressional hearing.",
        source: "Reuters / CNBC, Jan 28 2021",
      },
      {
        day: 10,
        dateLabel: "January 29, 2021",
        headline:
          "The SEC says it is 'closely monitoring' volatility in GameStop and other names, while Robinhood scrambles to raise over $1 billion in emergency funding.",
        source: "SEC statement / Reuters, Jan 29 2021",
      },
    ],
    summary:
      "GameStop's stock went from a single-digit afterthought to the center of a historic short squeeze as r/wallstreetbets retail traders piled in against heavily shorted hedge funds. Hype from Elon Musk, a chaotic Citron Research retreat, and Melvin Capital's forced unwind drove the stock to an all-time closing high of $86.88 (split-adjusted) on January 27, 2021. The saga climaxed when Robinhood and other brokers restricted buying the next day, sparking outrage and congressional scrutiny, even as the stock remained wildly volatile.",
  },
  {
    id: "amc-jun-2021-meme-rally",
    ticker: "AMC",
    companyName: "AMC Entertainment Holdings, Inc.",
    periodLabel: "May 27 – June 11, 2021",
    closes: [
      265.2, 261.2, 320.4, 625.5, 513.4, 479.1, 550.0, 550.5, 493.4, 428.1,
      494.0,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for AMC, May 27 – Jun 11 2021 (pre-2023 reverse-split basis; $625.50 close on June 2, 2021 is AMC's recognized all-time-high close).",
    redactTerms: ["AMC"],
    redactNames: ["Adam Aron"],
    headlines: [
      {
        day: 1,
        dateLabel: "May 28, 2021",
        headline:
          "AMC completes the sale of 8.5 million new shares to Mudrick Capital Management, raising roughly $230 million as its stock keeps climbing.",
        source: "Reuters / company filing, late May 2021",
      },
      {
        day: 2,
        dateLabel: "June 1, 2021",
        headline:
          "Retail trading volume in AMC surges again as r/wallstreetbets turns its attention from GameStop back to the movie theater chain.",
        source: "CNBC market coverage, Jun 1 2021",
      },
      {
        day: 3,
        dateLabel: "June 2, 2021",
        headline:
          "AMC stock skyrockets 95% in a single session after the company unveils 'AMC Investor Connect,' a retail-investor outreach program offering free popcorn and direct updates from CEO Adam Aron.",
        source: "CNBC / Reuters, Jun 2 2021",
      },
      {
        day: 4,
        dateLabel: "June 3, 2021",
        headline:
          "AMC sells 11.55 million new shares in an at-the-market offering, raising $587.4 million while its stock is still near record highs.",
        source: "Company SEC filing / Reuters, Jun 3 2021",
      },
      {
        day: 5,
        dateLabel: "June 4, 2021",
        headline:
          "AMC discloses plans to sell up to 11 million additional new shares, pressing its advantage with the stock's meme-fueled rally.",
        source: "SEC filing / Barron's, Jun 4 2021",
      },
      {
        day: 6,
        dateLabel: "June 7, 2021",
        headline:
          "Meme stocks reignite broadly as AMC and GameStop climb together again; AMC shares are reported up more than 17% in morning trading.",
        source: "CNBC market wrap, Jun 7 2021",
      },
      {
        day: 7,
        dateLabel: "June 8, 2021",
        headline:
          "AMC announces new shareholder perks, including a free large popcorn for retail investors who hold shares through an upcoming date, deepening its courtship of the 'Apes.'",
        source: "AMC company announcement, Jun 8 2021",
      },
      {
        day: 8,
        dateLabel: "June 9, 2021",
        headline:
          "Analysts warn that AMC's repeated new share sales into the rally are heavily diluting existing shareholders even as the stock stays elevated.",
        source: "Barron's / MarketWatch analysis, Jun 9 2021",
      },
      {
        day: 9,
        dateLabel: "June 10, 2021",
        headline:
          "AMC shares swing wildly again as options trading volume hits records, with no fresh company news driving the moves.",
        source: "CNBC / options market data, Jun 10 2021",
      },
      {
        day: 10,
        dateLabel: "June 11, 2021",
        headline:
          "AMC confirms it has now raised roughly $1.25 billion through 2021 stock sales, framing the moves as eliminating any near-term bankruptcy risk.",
        source: "Company statement / Reuters, Jun 11 2021",
      },
    ],
    summary:
      "Still recovering from pandemic-era near-bankruptcy, AMC became the second great meme-stock saga of 2021 as retail investors organized on Reddit piled into the stock. CEO Adam Aron leaned into the moment with direct shareholder outreach and perks, while the company opportunistically sold hundreds of millions of dollars in new shares into the rally. The stock hit an all-time closing high of $625.50 on June 2, 2021, up roughly 2,500% year-to-date, before swinging through extreme volatility in the weeks that followed.",
  },
  {
    id: "tsla-feb-mar-2020-covid-crash",
    ticker: "TSLA",
    companyName: "Tesla, Inc.",
    periodLabel: "February 19 – March 4, 2020",
    closes: [
      61.16, 59.96, 60.07, 55.59, 53.33, 51.92, 45.27, 44.53, 49.57, 49.7,
      49.97,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for TSLA, Feb 19 – Mar 4 2020 (adjusted for Tesla's later 5-for-1 and 3-for-1 stock splits).",
    redactTerms: ["Tesla"],
    redactNames: [],
    headlines: [
      {
        day: 1,
        dateLabel: "February 20, 2020",
        headline:
          "Tesla stock pulls back after a torrid run that briefly made it one of the most valuable automakers in the world, with analysts split on whether the rally has gone too far.",
        source: "Reuters / Motley Fool market commentary, Feb 2020",
      },
      {
        day: 2,
        dateLabel: "February 21, 2020",
        headline:
          "Wall Street grows more cautious on richly valued growth stocks as reports of a widening coronavirus outbreak outside China begin to worry global markets.",
        source: "Reuters global markets wrap, Feb 21 2020",
      },
      {
        day: 3,
        dateLabel: "February 24, 2020",
        headline:
          "Global stocks post their worst day in two years as coronavirus cases surge in Italy and South Korea, triggering a broad sell-off in growth and travel-sensitive names.",
        source: "Reuters / CNBC, Feb 24 2020",
      },
      {
        day: 4,
        dateLabel: "February 25, 2020",
        headline:
          "The Dow drops more than 800 points for a second straight day as the CDC warns Americans to prepare for likely community spread of the coronavirus in the U.S.",
        source: "CDC briefing / CNBC, Feb 25 2020",
      },
      {
        day: 5,
        dateLabel: "February 26, 2020",
        headline:
          "Markets stay volatile as the first possible U.S. case of coronavirus with no known travel history or exposure is reported in California.",
        source: "CDC / Reuters, Feb 26 2020",
      },
      {
        day: 6,
        dateLabel: "February 27, 2020",
        headline:
          "Wall Street suffers its worst day since the 2008 financial crisis as the Dow plunges over 1,100 points amid escalating pandemic fears.",
        source: "CNBC / Reuters, Feb 27 2020",
      },
      {
        day: 7,
        dateLabel: "February 28, 2020",
        headline:
          "Stocks cap their worst week since the financial crisis, with the S&P 500 down more than 10% from its recent record high, officially entering correction territory.",
        source: "Reuters market wrap, Feb 28 2020",
      },
      {
        day: 8,
        dateLabel: "March 2, 2020",
        headline:
          "Stocks rebound sharply on hopes that the Federal Reserve and other central banks will step in with coordinated action to cushion the economic hit from the virus.",
        source: "CNBC / Reuters, Mar 2 2020",
      },
      {
        day: 9,
        dateLabel: "March 3, 2020",
        headline:
          "The Federal Reserve makes an emergency half-point interest rate cut, its first between scheduled meetings since the 2008 crisis, but stocks whipsaw and close lower.",
        source: "Federal Reserve statement / Reuters, Mar 3 2020",
      },
      {
        day: 10,
        dateLabel: "March 4, 2020",
        headline:
          "Markets rally as Super Tuesday primary results and hopes for further stimulus briefly calm investors, even as coronavirus case counts keep climbing worldwide.",
        source: "Reuters market wrap, Mar 4 2020",
      },
    ],
    summary:
      "Tesla had just notched its pre-pandemic all-time high in February 2020 after a blistering multi-month rally. As COVID-19 spread beyond China and the Centers for Disease Control warned of likely U.S. community transmission, global markets entered a sudden, violent correction. Tesla fell alongside the broader market through late February, then whipsawed through the first emergency Fed rate cut in over a decade, foreshadowing the full-blown market-wide circuit-breaker crash that hit in mid-March.",
  },
  {
    id: "nvda-may-2023-ai-earnings",
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    periodLabel: "May 12 – May 26, 2023",
    closes: [
      28.34, 28.95, 29.21, 30.18, 31.68, 31.26, 31.18, 30.69, 30.54, 37.98,
      38.95,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for NVDA, May 12 – May 26 2023 (adjusted for Nvidia's later 10-for-1 stock split).",
    redactTerms: ["Nvidia", "NVIDIA"],
    redactNames: ["Jensen Huang"],
    headlines: [
      {
        day: 1,
        dateLabel: "May 15, 2023",
        headline:
          "Nvidia shares keep grinding higher heading into its fiscal Q1 earnings report, already up well over 100% year-to-date as AI enthusiasm builds on Wall Street.",
        source: "MarketWatch / InvestorPlace, mid-May 2023",
      },
      {
        day: 2,
        dateLabel: "May 16, 2023",
        headline:
          "Analysts flag Nvidia as the top-performing stock in the S&P 500 so far in 2023, driven almost entirely by excitement over generative AI demand for its data-center chips.",
        source: "InvestorPlace / Seeking Alpha, May 2023",
      },
      {
        day: 3,
        dateLabel: "May 17, 2023",
        headline:
          "Nvidia CEO Jensen Huang is scheduled to deliver a keynote at Computex in Taiwan, with investors watching closely for any hints on AI chip demand ahead of earnings.",
        source: "Reuters Computex preview, May 2023",
      },
      {
        day: 4,
        dateLabel: "May 18, 2023",
        headline:
          "Wall Street firms raise price targets on Nvidia ahead of its earnings report, citing surging enterprise interest in generative AI tools like ChatGPT.",
        source: "Seeking Alpha analyst notes, May 2023",
      },
      {
        day: 5,
        dateLabel: "May 19, 2023",
        headline:
          "Options traders pile into bets on a big post-earnings move for Nvidia, with implied volatility pricing in one of the largest swings of any S&P 500 company this earnings season.",
        source: "TheStreet / options market commentary, May 2023",
      },
      {
        day: 6,
        dateLabel: "May 22, 2023",
        headline:
          "Semiconductor stocks broadly climb as investors position ahead of Nvidia's earnings, viewed as a bellwether for the entire AI trade.",
        source: "Seeking Alpha sector preview, May 2023",
      },
      {
        day: 7,
        dateLabel: "May 23, 2023",
        headline:
          "Nvidia trades choppily as some investors book profits following its huge year-to-date run, with the stock still up more than 100% for 2023.",
        source: "Market commentary, May 23 2023",
      },
      {
        day: 8,
        dateLabel: "May 24, 2023",
        headline:
          "After the closing bell, Nvidia reports fiscal Q1 revenue of $7.19 billion that beats estimates, and stuns Wall Street with guidance for next quarter of about $11 billion versus analyst estimates near $7.2 billion.",
        source: "Nvidia earnings release / Reuters, May 24 2023",
      },
      {
        day: 9,
        dateLabel: "May 25, 2023",
        headline:
          "Nvidia stock surges roughly 24% in a single session — one of the largest one-day gains ever for a company of its size — as the AI-driven data-center guidance blows past expectations.",
        source: "Reuters / CNBC, May 25 2023",
      },
      {
        day: 10,
        dateLabel: "May 26, 2023",
        headline:
          "Nvidia's market capitalization approaches the $1 trillion mark for the first time, with analysts calling the AI chip boom a defining moment for the semiconductor industry.",
        source: "Reuters / CNBC, May 26 2023",
      },
    ],
    summary:
      "Nvidia entered its fiscal Q1 2024 earnings report already the best-performing stock in the S&P 500, riding a wave of generative-AI enthusiasm following the launch of ChatGPT. When the company not only beat estimates but guided next-quarter revenue to roughly $11 billion — about 50% above Wall Street's forecast — on soaring AI data-center demand, the stock exploded about 24% in a single day, one of the largest one-day gains ever for a company of its size, and pushed Nvidia to the doorstep of a $1 trillion valuation.",
  },
  {
    id: "cvna-may-2022-earnings-crash",
    ticker: "CVNA",
    companyName: "Carvana Co.",
    periodLabel: "May 4 – May 18, 2022",
    closes: [
      11.93, 9.78, 9.3, 7.75, 7.34, 6.0, 7.48, 7.66, 7.68, 8.32, 7.01,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for CVNA, May 4 – May 18 2022 (adjusted for Carvana's later 1-for-25 reverse stock split).",
    redactTerms: ["Carvana"],
    redactNames: [],
    headlines: [
      {
        day: 1,
        dateLabel: "May 5, 2022",
        headline:
          "Carvana shares plunge after the online used-car retailer reports a first-quarter loss of $506 million, far worse than the year-ago loss, and declines to give full-year guidance.",
        source: "Motley Fool / company earnings release, May 5 2022",
      },
      {
        day: 2,
        dateLabel: "May 6, 2022",
        headline:
          "Carvana stock keeps falling as investors digest the company's decision to sell roughly $1 billion in new stock just as shares are cratering.",
        source: "Reuters / company filing, May 6 2022",
      },
      {
        day: 3,
        dateLabel: "May 9, 2022",
        headline:
          "Carvana shares tumble another 18% as a broad tech and growth-stock sell-off intensifies the day after the Federal Reserve's half-point interest rate hike.",
        source: "CNBC / Reuters, May 9 2022",
      },
      {
        day: 4,
        dateLabel: "May 10, 2022",
        headline:
          "Morgan Stanley downgrades Carvana and slashes its price target from $360 to $105, citing concerns about the company's cash burn and liquidity.",
        source: "Morgan Stanley analyst note / CNBC, May 10 2022",
      },
      {
        day: 5,
        dateLabel: "May 11, 2022",
        headline:
          "Carvana announces it will raise an additional $2.3 billion in unsecured debt to help finance its acquisition of auto-auction company ADESA, adding to investor unease.",
        source: "Company press release / Reuters, May 11 2022",
      },
      {
        day: 6,
        dateLabel: "May 12, 2022",
        headline:
          "Shares attempt to stabilize after the stock's brutal multi-day slide, even as analysts debate whether Carvana's growth-at-all-costs model can survive a tougher financing environment.",
        source: "Fortune / market commentary, mid-May 2022",
      },
      {
        day: 7,
        dateLabel: "May 13, 2022",
        headline:
          "Broader markets rally to end a punishing week, offering meme-adjacent and high-growth stocks like Carvana a brief reprieve.",
        source: "Reuters market wrap, May 13 2022",
      },
      {
        day: 8,
        dateLabel: "May 16, 2022",
        headline:
          "Analysts note used-car prices are beginning to cool from pandemic peaks, raising fresh questions about Carvana's inventory and margins.",
        source: "Fortune analysis, May 2022",
      },
      {
        day: 9,
        dateLabel: "May 17, 2022",
        headline:
          "Carvana shares bounce along with a broader relief rally in beaten-down growth and e-commerce stocks.",
        source: "Market wrap, May 17 2022",
      },
      {
        day: 10,
        dateLabel: "May 18, 2022",
        headline:
          "Retail peers including Target and Walmart warn on margins, dragging consumer-facing growth stocks like Carvana back down as recession fears mount.",
        source: "Reuters retail-earnings coverage, May 18 2022",
      },
    ],
    summary:
      "Carvana's pandemic-era boom came crashing down in May 2022 when the online used-car retailer posted a far wider quarterly loss than expected, skipped full-year guidance, and then raised fresh stock and debt to fund its ADESA acquisition — all while the Fed hiked rates and growth stocks sold off broadly. Morgan Stanley slashed its price target from $360 to $105, and the stock roughly halved within two weeks, an early chapter in Carvana's slide toward near-bankruptcy fears later that year.",
  },
  {
    id: "pton-jan-2022-production-crash",
    ticker: "PTON",
    companyName: "Peloton Interactive, Inc.",
    periodLabel: "January 13 – January 28, 2022",
    closes: [
      32.15, 31.33, 30.23, 31.84, 24.22, 27.06, 29.71, 26.53, 24.75, 23.97,
      25.64,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for PTON, Jan 13 – Jan 28 2022.",
    redactTerms: ["Peloton"],
    redactNames: ["John Foley"],
    headlines: [
      {
        day: 1,
        dateLabel: "January 14, 2022",
        headline:
          "Peloton shares drift lower, continuing a months-long slide as reopening trends and slowing demand for home-fitness equipment weigh on the stock.",
        source: "Market commentary, mid-Jan 2022",
      },
      {
        day: 2,
        dateLabel: "January 18, 2022",
        headline:
          "Analysts cut price targets on Peloton, warning that competition and cooling pandemic-era demand are squeezing subscriber growth.",
        source: "Analyst notes, mid-Jan 2022",
      },
      {
        day: 3,
        dateLabel: "January 19, 2022",
        headline:
          "Peloton stock ticks up slightly ahead of what will become one of its most turbulent trading days, with no major company news yet disclosed.",
        source: "Market data, Jan 19 2022",
      },
      {
        day: 4,
        dateLabel: "January 20, 2022",
        headline:
          "CNBC reports, citing internal documents, that Peloton is pausing production of its flagship Bike for two months and its Tread treadmill for six weeks amid falling demand; shares close down 24%, erasing $2.5 billion in market value.",
        source: "CNBC, Jan 20 2022",
      },
      {
        day: 5,
        dateLabel: "January 21, 2022",
        headline:
          "Peloton CEO John Foley disputes CNBC's report, saying the company has 'identified a leaker' and that claims of halting all bike and Tread production are false, though he confirms production levels are being 'reset.'",
        source: "Peloton CEO statement / CNBC, Jan 20–21 2022",
      },
      {
        day: 6,
        dateLabel: "January 24, 2022",
        headline:
          "Reports surface that Amazon and private equity firms may be exploring a potential acquisition of Peloton, sending shares sharply higher.",
        source: "Puck / Bloomberg, Jan 24 2022",
      },
      {
        day: 7,
        dateLabel: "January 25, 2022",
        headline:
          "Peloton shares give back gains as investors question whether a takeover is actually likely, with no confirmed bid from any suitor.",
        source: "Market commentary, Jan 25 2022",
      },
      {
        day: 8,
        dateLabel: "January 26, 2022",
        headline:
          "Peloton confirms it is cutting corporate jobs and restructuring its leadership team as part of a broader cost-cutting plan under pressure from activist investors.",
        source: "Company statement / Reuters, Jan 26 2022",
      },
      {
        day: 9,
        dateLabel: "January 27, 2022",
        headline:
          "Peloton stock continues to slide as broader tech and growth stocks sell off sharply following hawkish signals from the Federal Reserve.",
        source: "Reuters market wrap, Jan 27 2022",
      },
      {
        day: 10,
        dateLabel: "January 28, 2022",
        headline:
          "Peloton shares bounce along with a broad market rally, but remain down sharply for the month as investors await the company's next earnings report.",
        source: "Market data, Jan 28 2022",
      },
    ],
    summary:
      "Peloton's pandemic-era boom unraveled fast in January 2022 after CNBC reported the company was halting production of its core Bike and Tread products due to collapsing demand. Shares plunged 24% in a single day, erasing billions in market value, even as CEO John Foley disputed the specifics. Takeover speculation involving Amazon briefly lifted the stock before reality set back in, and days later Foley confirmed layoffs and a leadership shakeup — a precursor to his later ouster as CEO.",
  },
  {
    id: "rivn-nov-2021-ipo-volatility",
    ticker: "RIVN",
    companyName: "Rivian Automotive, Inc.",
    periodLabel: "November 10 – November 24, 2021",
    closes: [
      100.73, 122.99, 129.95, 149.36, 172.01, 146.07, 123.38, 128.6, 118.11,
      119.85, 114.85,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for RIVN, Nov 10 – Nov 24 2021 (first trading day's close used as the baseline, since Nov 10, 2021 was Rivian's IPO day).",
    redactTerms: ["Rivian", "R1T"],
    redactNames: [],
    headlines: [
      {
        day: 1,
        dateLabel: "November 11, 2021",
        headline:
          "Rivian shares close their first day of trading at $100.73, up 29% from its $78 IPO price, in the largest U.S. stock offering since Facebook's 2012 listing.",
        source: "Reuters / Fortune, Nov 10 2021",
      },
      {
        day: 2,
        dateLabel: "November 12, 2021",
        headline:
          "Rivian's market valuation briefly tops $100 billion on a fully diluted basis, exceeding General Motors and Ford despite having delivered only a handful of vehicles.",
        source: "Fortune / Reuters, Nov 2021",
      },
      {
        day: 3,
        dateLabel: "November 15, 2021",
        headline:
          "Rivian stock keeps climbing as index-fund buying and short covering add fuel to the rally in the newly public EV maker.",
        source: "Market commentary, mid-Nov 2021",
      },
      {
        day: 4,
        dateLabel: "November 16, 2021",
        headline:
          "Rivian shares hit a fresh post-IPO high as enthusiasm for electric-vehicle startups remains at a fever pitch following Tesla's blockbuster year.",
        source: "CNBC market wrap, Nov 16 2021",
      },
      {
        day: 5,
        dateLabel: "November 17, 2021",
        headline:
          "Rivian stock pulls back sharply from its highs as some early investors and IPO allocants begin locking in profits.",
        source: "Market data, Nov 17 2021",
      },
      {
        day: 6,
        dateLabel: "November 18, 2021",
        headline:
          "Rivian discloses in a regulatory filing that it is recalling nearly all of its delivered R1T trucks over a loose fastener issue, adding a reality check to the EV hype.",
        source: "SEC filing / Reuters, Nov 18 2021",
      },
      {
        day: 7,
        dateLabel: "November 19, 2021",
        headline:
          "Rivian shares stabilize as analysts debate whether the stock's valuation can be justified given the company's still-tiny production volumes.",
        source: "Analyst commentary, Nov 2021",
      },
      {
        day: 8,
        dateLabel: "November 22, 2021",
        headline:
          "Broader growth and EV stocks wobble as rising bond yields pressure high-multiple names across the market.",
        source: "Reuters market wrap, Nov 22 2021",
      },
      {
        day: 9,
        dateLabel: "November 23, 2021",
        headline:
          "Rivian stock ticks higher ahead of the Thanksgiving holiday as investors weigh the company's ambitious production targets for 2022.",
        source: "Market data, Nov 23 2021",
      },
      {
        day: 10,
        dateLabel: "November 24, 2021",
        headline:
          "Rivian shares drift in a shortened holiday trading session, still up sharply from its IPO price despite the recent pullback from post-listing highs.",
        source: "Market data, Nov 24 2021",
      },
    ],
    summary:
      "Rivian's November 2021 debut was one of the largest and most electric IPOs in years: shares priced at $78 and immediately popped, briefly giving the unprofitable, barely-producing EV startup a market value exceeding General Motors and Ford combined. The euphoria peaked around $172 within a week before a vehicle recall disclosure and rising bond yields brought the stock back to earth, foreshadowing the much steeper declines Rivian would face in the following year.",
  },
  {
    id: "meta-feb-2022-earnings-crash",
    ticker: "META",
    companyName: "Meta Platforms, Inc.",
    periodLabel: "January 27 – February 10, 2022",
    closes: [
      294.64, 301.71, 313.26, 319.0, 323.0, 237.76, 237.09, 224.91, 220.18,
      232.0, 228.07,
    ],
    priceSource:
      "Yahoo Finance historical daily closes for META, Jan 27 – Feb 10 2022.",
    redactTerms: ["Meta Platforms", "Meta", "Facebook", "Instagram"],
    redactNames: [],
    headlines: [
      {
        day: 1,
        dateLabel: "January 28, 2022",
        headline:
          "Meta Platforms stock climbs along with a broader tech rebound, with investors awaiting the company's fourth-quarter earnings report the following week.",
        source: "Market data, Jan 28 2022",
      },
      {
        day: 2,
        dateLabel: "January 31, 2022",
        headline:
          "Meta shares extend their gains as risk appetite returns to growth and tech stocks following a rough January for the Nasdaq.",
        source: "Reuters market wrap, Jan 31 2022",
      },
      {
        day: 3,
        dateLabel: "February 1, 2022",
        headline:
          "Meta stock rises further ahead of its earnings release, even as some analysts flag growing competitive pressure on Facebook and Instagram from TikTok.",
        source: "Analyst commentary, early Feb 2022",
      },
      {
        day: 4,
        dateLabel: "February 2, 2022",
        headline:
          "After the closing bell, Meta reports that Facebook's daily active users declined quarter-over-quarter for the first time ever, falling from 1.930 billion to 1.929 billion, and issues weak revenue guidance citing Apple's privacy changes and competition from TikTok.",
        source: "Meta earnings release / CNBC, Feb 2 2022",
      },
      {
        day: 5,
        dateLabel: "February 3, 2022",
        headline:
          "Meta shares plummet about 26% in a single session, wiping out roughly $230 billion in market value — the largest one-day drop in market capitalization for any U.S. company in history at the time.",
        source: "CNBC / Reuters, Feb 3 2022",
      },
      {
        day: 6,
        dateLabel: "February 4, 2022",
        headline:
          "Meta shares stay depressed as Wall Street analysts slash price targets, pointing to Apple's App Tracking Transparency changes costing the company an estimated $10 billion in 2022.",
        source: "Analyst notes / Reuters, Feb 4 2022",
      },
      {
        day: 7,
        dateLabel: "February 7, 2022",
        headline:
          "Meta stock drifts lower as commentators debate whether the DAU decline marks a structural turning point for Facebook or a temporary blip.",
        source: "Market commentary, Feb 7 2022",
      },
      {
        day: 8,
        dateLabel: "February 8, 2022",
        headline:
          "Meta shares touch a fresh post-earnings low as broader tech stocks remain under pressure from rising interest-rate expectations.",
        source: "Reuters market wrap, Feb 8 2022",
      },
      {
        day: 9,
        dateLabel: "February 9, 2022",
        headline:
          "Meta stock bounces modestly as some value-oriented investors argue the post-earnings sell-off was overdone relative to the company's ad business fundamentals.",
        source: "Market commentary, Feb 9 2022",
      },
      {
        day: 10,
        dateLabel: "February 10, 2022",
        headline:
          "Meta shares pull back again as a hot U.S. inflation report reignites fears of aggressive Federal Reserve rate hikes, hitting growth stocks broadly.",
        source: "Reuters market wrap, Feb 10 2022",
      },
    ],
    summary:
      "Meta Platforms stock was riding a multi-day rally into its February 2, 2022 earnings report, but the results delivered a historic shock: Facebook's daily active users fell for the first time ever, and the company warned of a roughly $10 billion hit from Apple's privacy changes alongside intensifying competition from TikTok. The stock plunged about 26% the next day, erasing roughly $230 billion in market value in a single session — at the time the largest one-day market-cap loss for any U.S. company ever — and shares stayed depressed as a broader market sell-off took hold.",
  },
];
