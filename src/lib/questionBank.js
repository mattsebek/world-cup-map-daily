const BANK = {
  ARG:{difficulty:"Medium",clues:[
    {type:"player",text:"Its attack is built around a left-footed playmaker who captained the side to glory and spent his prime at a Catalan giant."},
    {type:"history",text:"Three-time world champions — most recently lifting the trophy in 2022."},
    {type:"geography",text:"Its capital sits on the Río de la Plata, across the estuary from Uruguay."}
  ],reveal:{title:"Argentina",capital:"Buenos Aires",body:"La Albiceleste are one of football's great powers, blending flair with grit. Buenos Aires, the tango capital, anchors a nation that lives and breathes the game."}},

  JPN:{difficulty:"Medium",clues:[
    {type:"geography",text:"An archipelago in the western Pacific whose capital is the world's largest metropolitan area."},
    {type:"history",text:"A World Cup ever-present since 1998, it has never missed a tournament this century."},
    {type:"player",text:"The Samurai Blue stock Europe's top leagues and press with relentless discipline."}
  ],reveal:{title:"Japan",capital:"Tokyo",body:"Japan pairs technical midfield play with ferocious work rate, and its travelling fans famously tidy the stands. Tokyo is the planet's most populous metro area."}},

  MAR:{difficulty:"Hard",clues:[
    {type:"history",text:"In 2022 it became the first African and Arab nation to reach a World Cup semifinal."},
    {type:"geography",text:"At Africa's northwest tip, it lies a short ferry across the Strait of Gibraltar from Europe."},
    {type:"culture",text:"Mint tea, medinas, and a fanbase that turned a World Cup run into a continent-wide celebration."}
  ],reveal:{title:"Morocco",capital:"Rabat",body:"The Atlas Lions' 2022 run electrified Africa and the Arab world. Rabat is the coastal capital, though Casablanca is the largest city."}},

  HRV:{difficulty:"Medium",clues:[
    {type:"history",text:"Runners-up in 2018 and semifinalists in 2022 — extraordinary for a nation of under four million."},
    {type:"geography",text:"A crescent along the Adriatic, instantly known by its red-and-white checkerboard."},
    {type:"culture",text:"Its walled coastal city is a magnet for film crews and tourists."}
  ],reveal:{title:"Croatia",capital:"Zagreb",body:"Croatia punches far above its size, driven by a golden midfield generation. Zagreb is the inland capital; the Dalmatian coast draws the crowds."}},

  BRA:{difficulty:"Easy",clues:[
    {type:"history",text:"The only nation to win the World Cup five times."},
    {type:"geography",text:"South America's largest country; its purpose-built capital opened in 1960."},
    {type:"culture",text:"The spiritual home of jogo bonito and the yellow-and-green canarinho."}
  ],reveal:{title:"Brazil",capital:"Brasília",body:"Brazil's joga bonito has defined the sport for generations. Brasília, the modernist capital carved out of the highlands, opened in 1960."}},

  MEX:{difficulty:"Medium",clues:[
    {type:"player",text:"Its goalkeeper played at six World Cups, becoming one of the most legendary shot-stoppers the tournament has ever seen."},
    {type:"history",text:"This nation reached the Round of 16 at seven consecutive tournaments — a streak haunted by the infamous curse of the 'fifth match'."},
    {type:"geography",text:"Its capital is the most populous city in North America, built atop a drained lake at over 7,000 feet elevation."}
  ],reveal:{title:"Mexico",capital:"Mexico City",body:"El Tri are a World Cup fixture. Mexico City, built on ancient Aztec foundations, sits in a high volcanic valley and is one of the world's great metropolises."}},

  ZAF:{difficulty:"Medium",clues:[
    {type:"culture",text:"Known as 'Bafana Bafana' — a Zulu phrase meaning 'the boys, the boys' — they play in yellow and green."},
    {type:"history",text:"They hosted the 2010 World Cup, the first tournament ever staged on African soil."},
    {type:"geography",text:"The southernmost nation on its continent, it almost entirely surrounds a small independent landlocked kingdom."}
  ],reveal:{title:"South Africa",capital:"Pretoria",body:"Bafana Bafana made history hosting 2010. Pretoria is the executive capital; Cape Town and Johannesburg are also major cities."}},

  KOR:{difficulty:"Medium",clues:[
    {type:"player",text:"Its captain plays for a top-six Premier League club and is Asia's all-time leading international scorer."},
    {type:"history",text:"Co-hosted the 2002 tournament and became the first — and still only — Asian team to reach the semifinals."},
    {type:"geography",text:"A peninsula in East Asia whose capital sits just 35 miles from a heavily fortified border."}
  ],reveal:{title:"South Korea",capital:"Seoul",body:"The Taeguk Warriors shocked the world in 2002, reaching the last four. Seoul, a tech powerhouse of 25 million, faces North Korea across the DMZ."}},

  CZE:{difficulty:"Hard",clues:[
    {type:"player",text:"Its players have anchored squads at West Ham, Bayer Leverkusen, and clubs across the Bundesliga."},
    {type:"history",text:"As part of a predecessor state, it reached the World Cup final twice — in 1934 and 1962 — without ever winning."},
    {type:"geography",text:"A landlocked Central European nation whose capital, a city of Gothic spires on the Vltava River, is one of the continent's most visited."}
  ],reveal:{title:"Czechia",capital:"Prague",body:"Czech football punches above its weight. Prague, the 'City of a Hundred Spires', is one of Europe's best-preserved medieval capitals."}},

  CAN:{difficulty:"Medium",clues:[
    {type:"player",text:"Its left-back plays for Bayern Munich and is considered the greatest Canadian footballer in history."},
    {type:"history",text:"Qualified for 2022 — its first World Cup in 36 years — and in 2026 is one of three co-hosts of the tournament."},
    {type:"geography",text:"The second-largest country by area on Earth, sharing the world's longest land border with its southern neighbour."}
  ],reveal:{title:"Canada",capital:"Ottawa",body:"The Canucks return as co-hosts. Ottawa sits near the Québec border; the country spans six time zones from Pacific to Atlantic."}},

  CHE:{difficulty:"Medium",clues:[
    {type:"player",text:"Its combative captain has led Arsenal and is one of the Premier League's most influential midfielders."},
    {type:"history",text:"A neutral nation in global politics, it has reached the knockout rounds in four of the last five World Cups."},
    {type:"geography",text:"Landlocked in the Alps, it borders five countries and has four official national languages."}
  ],reveal:{title:"Switzerland",capital:"Bern",body:"The Swiss blend tenacity with technical quality. Bern is the federal city; Geneva, Zürich, and Basel are better known internationally."}},

  QAT:{difficulty:"Hard",clues:[
    {type:"player",text:"The 'Maroon' have developed homegrown talent through the Aspire Academy, one of the world's most lavishly funded football academies."},
    {type:"history",text:"Became the first host nation in World Cup history to be eliminated in the group stage, in 2022."},
    {type:"geography",text:"A small peninsula jutting into the Persian Gulf, it is one of the wealthiest nations per capita on Earth due to vast natural gas reserves."}
  ],reveal:{title:"Qatar",capital:"Doha",body:"Qatar's 2022 hosting rights sparked global debate. Doha hosted the most compact World Cup in history, with all stadiums within driving distance."}},

  BIH:{difficulty:"Hard",clues:[
    {type:"player",text:"Its all-time leading scorer spent years at Roma and Inter Milan, becoming a Serie A legend."},
    {type:"history",text:"Made its only World Cup appearance in 2014 in Brazil, fighting out of a group with Argentina and Nigeria."},
    {type:"geography",text:"A Western Balkan nation whose capital famously hosted the 1984 Winter Olympics and survived a devastating 44-month siege in the 1990s."}
  ],reveal:{title:"Bosnia & Herzegovina",capital:"Sarajevo",body:"The Dragons qualified impressively for Brazil 2014. Sarajevo, in a mountain valley, blends Ottoman, Austro-Hungarian, and modern European heritage."}},

  GBR:{difficulty:"Hard",clues:[
    {type:"player",text:"Its captain, a left-back at a storied English club, is considered one of the best in the world in his position."},
    {type:"history",text:"One of the founders of international football — it played in the very first international match in 1872 — yet has not reached the knockout stage of a major tournament since 1998."},
    {type:"geography",text:"The northern portion of Great Britain, famed for its Highlands, ancient lochs, and whisky distilleries."}
  ],reveal:{title:"Scotland",capital:"Edinburgh",body:"Scotland's long wait for knockout football makes every qualification precious. Edinburgh, perched below an ancient volcanic castle, is one of Europe's most dramatic capitals."}},

  HTI:{difficulty:"Hard",clues:[
    {type:"player",text:"Its squad draws from the Caribbean diaspora, with talent developed through links to clubs in France and the United States."},
    {type:"history",text:"The first Caribbean nation to reach a World Cup, in 1974, where it held its own against Italy in the group stage."},
    {type:"geography",text:"It occupies the western third of a large Caribbean island it shares with another country."}
  ],reveal:{title:"Haiti",capital:"Port-au-Prince",body:"Les Grenadiers are the Caribbean's finest footballing hope. Port-au-Prince sits on a bay in the west of Hispaniola, the island shared with the Dominican Republic."}},

  USA:{difficulty:"Easy",clues:[
    {type:"player",text:"Its 'Captain America' plays in Serie A and is one of the most recognisable faces in modern football."},
    {type:"history",text:"Reached the semifinals in the very first World Cup in 1930; the 2026 tournament is co-hosted across its cities."},
    {type:"geography",text:"The third-largest country by area, it spans from the Atlantic to the Pacific with a famous cultural capital on each coast."}
  ],reveal:{title:"United States",capital:"Washington D.C.",body:"The USMNT co-hosts 2026 alongside Canada and Mexico. D.C. is the political capital, but New York, Los Angeles, and Miami will host matches."}},

  PRY:{difficulty:"Hard",clues:[
    {type:"player",text:"Its Premier League representative came up through Atlético Madrid's renowned youth academy."},
    {type:"history",text:"Reached the quarterfinals in 2010 before falling to Spain, the eventual champions."},
    {type:"geography",text:"A landlocked South American nation entirely enclosed by its three neighbours, with no coastline whatsoever."}
  ],reveal:{title:"Paraguay",capital:"Asunción",body:"La Albirroja have consistently surprised at World Cups. Asunción, on the Río Paraguay, is one of South America's oldest colonial cities."}},

  AUS:{difficulty:"Medium",clues:[
    {type:"player",text:"Its talismanic striker scored one of the 2022 tournament's most crucial round-of-16 goals to knock out Denmark."},
    {type:"history",text:"Reached the Round of 16 at their first serious tournament appearance in 2006 under Guus Hiddink."},
    {type:"geography",text:"The only country that is also a continent, it competes in the Asian Football Confederation after switching from Oceania."}
  ],reveal:{title:"Australia",capital:"Canberra",body:"The Socceroos are Oceania's footballing powerhouse. Canberra is the planned capital, though Sydney and Melbourne are far larger."}},

  TUR:{difficulty:"Medium",clues:[
    {type:"player",text:"Its teenage Real Madrid star burst onto the scene at Euro 2024, while its captain drives one of Italy's top clubs."},
    {type:"history",text:"Finished third at the 2002 World Cup — its best-ever result — after defeating South Korea and Senegal."},
    {type:"geography",text:"A transcontinental nation straddling Europe and Asia, split by a famous strait connecting the Black Sea to the Mediterranean."}
  ],reveal:{title:"Türkiye",capital:"Ankara",body:"The Crescent Stars are a rising force. Ankara is the capital, but Istanbul — astride the Bosphorus — is the country's cultural and economic heart."}},

  DEU:{difficulty:"Easy",clues:[
    {type:"player",text:"Its creative midfield duo — from Bayern and Leverkusen — represent a gilded generational handover for the four-time champions."},
    {type:"history",text:"The only team to have appeared in every World Cup in which it was eligible, winning in 1954, 1974, 1990, and 2014."},
    {type:"geography",text:"Central Europe's largest economy, bordered by nine countries — more neighbours than any other nation on the continent."}
  ],reveal:{title:"Germany",capital:"Berlin",body:"Die Mannschaft are one of the sport's great powers. Berlin, reunified after the Cold War, is one of Europe's most vibrant capitals."}},

  ECU:{difficulty:"Medium",clues:[
    {type:"player",text:"Its all-time top scorer opened the 2022 World Cup with two goals in the very first game."},
    {type:"history",text:"Kicked off the 2022 tournament by beating the host nation in the opening match."},
    {type:"geography",text:"Named after the imaginary line it straddles — the one dividing the planet's northern and southern hemispheres."}
  ],reveal:{title:"Ecuador",capital:"Quito",body:"La Tri's 2022 opening-game heroics set the tone. Quito, at 9,350 feet, is one of the world's highest capital cities — and sits right on the equator."}},

  CIV:{difficulty:"Medium",clues:[
    {type:"player",text:"Its most famous modern player carried the nation on his back at three World Cups, scoring 11 goals in the tournament."},
    {type:"history",text:"Its 'golden generation' qualified for 2006, 2010, and 2014 — always drawing a rival African power in the group stage."},
    {type:"geography",text:"A West African nation whose French name translates to 'Ivory Coast', reflecting a historic trade once conducted from its shores."}
  ],reveal:{title:"Côte d'Ivoire",capital:"Yamoussoukro",body:"Les Éléphants are West Africa's most consistent World Cup force. Yamoussoukro is the official capital, though Abidjan is the economic powerhouse."}},

  CUW:{difficulty:"Hard",clues:[
    {type:"player",text:"Many of its players grew up in Dutch youth systems and carry dual citizenship with the Netherlands."},
    {type:"history",text:"This is its first ever World Cup appearance — a landmark moment for Caribbean football."},
    {type:"geography",text:"A small Caribbean island and constituent country of a European kingdom, known for its vivid Dutch colonial waterfront architecture."}
  ],reveal:{title:"Curaçao",capital:"Willemstad",body:"Curaçao's 2026 debut is a historic moment. Willemstad's iconic pastel waterfront is a UNESCO World Heritage Site."}},

  NLD:{difficulty:"Medium",clues:[
    {type:"player",text:"Its captain is arguably the world's best centre-back, while its creative hub drives one of Europe's most successful clubs."},
    {type:"history",text:"Three-time World Cup finalists — 1974, 1978, and 2010 — without ever lifting the trophy. Pioneers of 'Total Football'."},
    {type:"geography",text:"A low-lying northwestern European nation famous for reclaiming land from the sea; roughly a quarter of its territory is below sea level."}
  ],reveal:{title:"Netherlands",capital:"Amsterdam",body:"The Clockwork Orange have defined attacking football without the ultimate prize. Amsterdam is the capital; The Hague is the seat of government."}},

  SWE:{difficulty:"Medium",clues:[
    {type:"player",text:"Its current attack is led by a Newcastle United striker and a Tottenham creator, both with Balkan heritage."},
    {type:"history",text:"Hosted and reached the final of the 1958 World Cup; finished third in the USA in 1994 with a generation that included a striker now considered their greatest ever."},
    {type:"geography",text:"The largest of the three Scandinavian countries by area, sharing a long peninsula with its western neighbour."}
  ],reveal:{title:"Sweden",capital:"Stockholm",body:"Blågult (Blue-Yellow) are consistent overachievers. Stockholm, built on 14 islands where Lake Mälaren meets the Baltic, is called the 'Venice of the North'."}},

  TUN:{difficulty:"Hard",clues:[
    {type:"player",text:"Its midfield is organised around players from French Ligue 1 and the Saudi Pro League."},
    {type:"history",text:"The first African team to win a World Cup group-stage match, defeating Mexico in 1978."},
    {type:"geography",text:"The northernmost country on the African continent, sitting on the Mediterranean directly south of Italy and Sicily."}
  ],reveal:{title:"Tunisia",capital:"Tunis",body:"The Eagles of Carthage carry North Africa's hopes. Tunis sits near the ruins of ancient Carthage, once Rome's great rival for Mediterranean dominance."}},

  BEL:{difficulty:"Medium",clues:[
    {type:"player",text:"Its playmaker is widely considered the best midfielder of his generation, conducting games from the deepest position."},
    {type:"history",text:"Reached third place in 2018 with what was dubbed their 'golden generation' — briefly the world's top-ranked nation."},
    {type:"geography",text:"One of Western Europe's smallest nations, it is the headquarters of both the European Union and NATO."}
  ],reveal:{title:"Belgium",capital:"Brussels",body:"The Red Devils' 2018 run was the golden generation's highlight. Brussels hosts the EU and NATO; the country is divided between Dutch-speaking Flanders and French-speaking Wallonia."}},

  EGY:{difficulty:"Medium",clues:[
    {type:"player",text:"Its star has won two Golden Boots in the Premier League and is widely regarded as one of the greatest players of his generation."},
    {type:"history",text:"The first African nation ever to qualify for a World Cup, back in 1934 — decades before most African states existed."},
    {type:"geography",text:"Northeast Africa's anchor, home to the world's longest river, one of humanity's oldest civilisations, and iconic ancient monuments."}
  ],reveal:{title:"Egypt",capital:"Cairo",body:"The Pharaohs are Africa's most historically significant football nation. Cairo, Africa's largest city, sits where the Nile fans into its delta before meeting the Mediterranean."}},

  IRN:{difficulty:"Medium",clues:[
    {type:"player",text:"Its Porto and Inter Milan striker is one of the most prolific forwards in European football."},
    {type:"history",text:"A regular World Cup presence since 1978; in 2022 it beat both Wales and the United States in the group stage."},
    {type:"geography",text:"A vast Middle Eastern nation bordering both the Persian Gulf and the Caspian Sea, one of history's oldest civilisations."}
  ],reveal:{title:"Iran",capital:"Tehran",body:"Team Melli are the most successful football nation in Western Asia. Tehran, at the foot of the Alborz Mountains, is home to nearly 10 million people."}},

  NZL:{difficulty:"Hard",clues:[
    {type:"player",text:"Its captain and all-time leading scorer has played in England and Turkey across a long international career."},
    {type:"history",text:"The only team to leave a World Cup unbeaten without advancing — drawing all three group games at 2010 in South Africa."},
    {type:"geography",text:"A two-island nation in the South Pacific, southeast of Australia, with a strong indigenous Māori culture and landscapes that doubled as Middle-earth in film."}
  ],reveal:{title:"New Zealand",capital:"Wellington",body:"The All Whites are Oceania's football ambassadors. Wellington, on the windy southern tip of the North Island, is one of the world's most remote capital cities."}},

  ESP:{difficulty:"Easy",clues:[
    {type:"player",text:"Its current squad, built around teenage prodigies and brilliant midfielders, won Euro 2024 with some of the most attractive football in years."},
    {type:"history",text:"Won the 2010 World Cup in South Africa with a brand of possession play — 'tiki-taka' — that transformed global football."},
    {type:"geography",text:"Europe's fourth-largest country, occupying most of the Iberian Peninsula in the continent's southwest corner."}
  ],reveal:{title:"Spain",capital:"Madrid",body:"La Roja's 2010 triumph capped a decade of dominance. Madrid, at the geographic centre of the Iberian Peninsula, is one of Europe's great cultural capitals."}},

  CPV:{difficulty:"Hard",clues:[
    {type:"player",text:"Many of its players carry Portuguese passports and compete in European leagues through ties to its colonial heritage."},
    {type:"history",text:"This is its first ever World Cup appearance — a moment of national pride for a tiny Atlantic nation."},
    {type:"geography",text:"A volcanic archipelago of ten islands in the Atlantic Ocean, roughly 570 km off the west coast of Africa."}
  ],reveal:{title:"Cabo Verde",capital:"Praia",body:"The Blue Sharks' 2026 debut marks a stunning rise. Praia, on the island of Santiago, is the capital of this Portuguese-speaking Atlantic archipelago."}},

  SAU:{difficulty:"Medium",clues:[
    {type:"player",text:"Its winger scored one of the most celebrated goals in recent World Cup history to complete a famous comeback victory."},
    {type:"history",text:"In 2022, it came from behind to defeat the eventual champions in its opening group-stage game — one of the greatest upsets in tournament history."},
    {type:"geography",text:"The Arabian Peninsula's dominant nation, the world's largest exporter of crude oil, and home to Islam's two holiest cities."}
  ],reveal:{title:"Saudi Arabia",capital:"Riyadh",body:"The Green Falcons' 2022 win over Argentina was a seismic shock. Riyadh, an ultramodern desert city, is undergoing rapid transformation as the kingdom diversifies beyond oil."}},

  URY:{difficulty:"Medium",clues:[
    {type:"player",text:"Its Liverpool striker leads a line steeped in the tradition of winners like Suárez and Forlán."},
    {type:"history",text:"Won the first ever World Cup in 1930 on home soil, then repeated the feat in 1950 with the famous 'Maracanazo' — beating Brazil in the deciding match."},
    {type:"geography",text:"The smallest Spanish-speaking country in South America, sandwiched between two giants on the Río de la Plata estuary."}
  ],reveal:{title:"Uruguay",capital:"Montevideo",body:"La Celeste are football royalty despite their size. Montevideo, facing the Río de la Plata, hosted the first-ever World Cup final in 1930."}},

  FRA:{difficulty:"Easy",clues:[
    {type:"player",text:"Its captain, the world's most expensive player and a three-time Champions League winner, leads the defending runners-up."},
    {type:"history",text:"Two-time World Cup champions (1998 at home and 2018 in Russia), they were finalists again in 2022."},
    {type:"geography",text:"Western Europe's largest country by area, shaped roughly like a hexagon and bordering eight nations and two seas."}
  ],reveal:{title:"France",capital:"Paris",body:"Les Bleus are the sport's pre-eminent modern power. Paris, host of the 2024 Olympics, is Europe's most-visited city."}},

  SEN:{difficulty:"Medium",clues:[
    {type:"player",text:"Its talismanic forward played for Liverpool and Bayern Munich before moving to the Saudi Pro League."},
    {type:"history",text:"Reached the quarterfinals in their debut World Cup in 2002, stunning France — the defending champions — in the opening game; won the Africa Cup of Nations in 2022."},
    {type:"geography",text:"The westernmost country on the African mainland, its capital is the closest major African city to South America."}
  ],reveal:{title:"Senegal",capital:"Dakar",body:"The Lions of Teranga are West Africa's most successful team on the biggest stages. Dakar, on the Cap-Vert peninsula, juts further west than any other African capital."}},

  NOR:{difficulty:"Medium",clues:[
    {type:"player",text:"Its striker holds the record as the fastest player to reach 50 Champions League goals."},
    {type:"history",text:"Last qualified for a World Cup in 1998, where it famously beat Brazil in the group stage; a new generation led by a prolific centre-forward has finally ended the wait."},
    {type:"geography",text:"The western half of the Scandinavian Peninsula, famed for dramatic fjords carved by ancient glaciers and a coastline stretching nearly 60,000 km."}
  ],reveal:{title:"Norway",capital:"Oslo",body:"Haaland's Norway returns to the world stage after a long absence. Oslo sits at the head of Oslofjord; the country's oil wealth funds one of the world's largest sovereign wealth funds."}},

  IRQ:{difficulty:"Hard",clues:[
    {type:"player",text:"Its national team, the 'Lions of Mesopotamia', draws on dual-nationality players from diaspora communities across Europe."},
    {type:"history",text:"Made its only previous World Cup appearance in 1986 in Mexico, where it was eliminated without registering a win."},
    {type:"geography",text:"Situated between two of the ancient world's most famous rivers, it is considered one of the cradles of civilisation — home to Babylon and the Sumerian city-states."}
  ],reveal:{title:"Iraq",capital:"Baghdad",body:"The Lions of Mesopotamia are making history at the 2026 World Cup. Baghdad, on the Tigris, was once the largest city in the medieval world as the Abbasid Caliphate's seat."}},

  DZA:{difficulty:"Medium",clues:[
    {type:"player",text:"Its former Premier League winger became a national hero after inspiring its run to the 2019 Africa Cup of Nations title."},
    {type:"history",text:"Produced one of the World Cup's great upsets in 1982, defeating the reigning European champions in their opening group game."},
    {type:"geography",text:"The largest country on the African continent — and in the Arab world — with most of its vast territory covered by the Sahara Desert."}
  ],reveal:{title:"Algeria",capital:"Algiers",body:"Les Fennecs' 2014 run to the Round of 16 thrilled the nation. Algiers, a Mediterranean port city climbing white hillsides, is nicknamed 'Algiers the White'."}},

  AUT:{difficulty:"Hard",clues:[
    {type:"player",text:"Its versatile Real Madrid captain was one of the highest-paid footballers in the world at his peak."},
    {type:"history",text:"Enjoyed its golden era in the 1950s, finishing third at the 1954 World Cup; Euro 2024 was a sign of a modern resurgence."},
    {type:"geography",text:"A landlocked Alpine nation in Central Europe, birthplace of Mozart, Freud, and the painter Klimt."}
  ],reveal:{title:"Austria",capital:"Vienna",body:"The Austrian national team is experiencing a genuine renaissance. Vienna, on the Danube, was the capital of the Austro-Hungarian Empire and remains one of Europe's cultural treasures."}},

  JOR:{difficulty:"Hard",clues:[
    {type:"player",text:"Its squad blends domestic talent with diaspora players — one of very few Arab nations ever to qualify for a World Cup."},
    {type:"history",text:"This is its first ever World Cup appearance — qualification alone was a historic national achievement."},
    {type:"geography",text:"A Middle Eastern kingdom whose western border runs along the shores of the world's lowest point on Earth, a hypersaline lake where nothing can sink."}
  ],reveal:{title:"Jordan",capital:"Amman",body:"The Nashama's World Cup debut is a landmark. Amman, built across seven hills, is one of the oldest continuously inhabited cities on the planet, and ancient Petra is a wonder of the world."}},

  PRT:{difficulty:"Medium",clues:[
    {type:"player",text:"Its all-time top scorer holds the world record for international goals in men's football, having earned over 200 caps."},
    {type:"history",text:"Reached the semifinals in 1966 behind the legendary Eusébio; won Euro 2016; reached the quarterfinals in 2022."},
    {type:"geography",text:"The westernmost country in continental Europe, occupying the Atlantic edge of the Iberian Peninsula and once ruling a global empire from its seafaring capital."}
  ],reveal:{title:"Portugal",capital:"Lisbon",body:"A Seleção carry Ronaldo's legacy and a bright new generation. Lisbon, one of Europe's oldest and sunniest capitals, sits where the Tagus meets the Atlantic."}},

  COD:{difficulty:"Hard",clues:[
    {type:"player",text:"Players from its Belgian and French diaspora have long fed European clubs, some choosing to represent the national team."},
    {type:"history",text:"As Zaire, it was the first sub-Saharan African team at a World Cup, in 1974 — a diplomatic showpiece for Mobutu's regime."},
    {type:"geography",text:"The second-largest country in Africa, sitting at the heart of the continent and home to the world's deepest river."}
  ],reveal:{title:"DR Congo",capital:"Kinshasa",body:"The Léopards return to the greatest stage after decades away. Kinshasa faces Brazzaville across the Congo River — making them the world's closest pair of national capitals."}},

  COL:{difficulty:"Medium",clues:[
    {type:"player",text:"Its Liverpool winger is one of the Premier League's most electrifying attackers, carrying the torch from a legendary 2014 playmaker."},
    {type:"history",text:"Reached the quarterfinals in 2014, with a flamboyant playmaker winning the Golden Boot in one of the tournament's great individual performances."},
    {type:"geography",text:"The only South American country with coastlines on both the Pacific Ocean and the Caribbean Sea."}
  ],reveal:{title:"Colombia",capital:"Bogotá",body:"Los Cafeteros combine flair with intensity. Bogotá, at 8,600 feet in the Andes, is one of the world's highest capital cities."}},

  UZB:{difficulty:"Hard",clues:[
    {type:"player",text:"Its Serie A striker has been one of the most productive forwards in Italian football in recent seasons."},
    {type:"history",text:"This is its first ever World Cup appearance — a breakthrough for Central Asian football."},
    {type:"geography",text:"One of only two doubly landlocked countries on Earth — entirely surrounded by other landlocked nations — and home to ancient Silk Road cities."}
  ],reveal:{title:"Uzbekistan",capital:"Tashkent",body:"The White Wolves' 2026 debut puts Central Asia on the football map. Tashkent is the largest city in Central Asia; Samarkand and Bukhara are Silk Road treasures."}},

  ENG:{difficulty:"Medium",clues:[
    {type:"player",text:"Its golden generation includes a Champions League record-scorer at Real Madrid and a midfielder named the world's best young player."},
    {type:"history",text:"The only World Cup it has ever won was in 1966 — at home at Wembley, in a final against West Germany."},
    {type:"geography",text:"The southern and most populous part of the island of Great Britain; universally accepted as the birthplace of the modern game."}
  ],reveal:{title:"England",capital:"London",body:"The Three Lions carry the weight of 1966. London, home to Wembley, is Europe's largest city and the global hub of club football."}},

  GHA:{difficulty:"Medium",clues:[
    {type:"player",text:"Its captain anchors Arsenal's midfield and is one of the Premier League's most dependable holding players."},
    {type:"history",text:"The most heartbreaking exit in African World Cup history: a quarterfinal in 2010, ended by an infamous last-minute handball that denied them a semifinal."},
    {type:"geography",text:"A West African nation on the Gulf of Guinea, named after an ancient empire that flourished in the region 1,000 years ago."}
  ],reveal:{title:"Ghana",capital:"Accra",body:"The Black Stars carry sub-Saharan Africa's football hopes. Accra, on the Atlantic coast, is one of West Africa's fastest-growing cities."}},

  PAN:{difficulty:"Hard",clues:[
    {type:"player",text:"With limited diaspora talent, the 'Canaleros' rely on a well-drilled collective rather than individual stars."},
    {type:"history",text:"Scored its first ever World Cup goal in 2018 — a consolation in defeat — but the celebration told the story of what simply being there meant."},
    {type:"geography",text:"The narrow S-shaped isthmus at the southern tip of Central America, where a famous engineering marvel allows ships to cross between two oceans."}
  ],reveal:{title:"Panama",capital:"Panama City",body:"Los Canaleros are punching above their weight. Panama City sits at the Pacific end of the canal that connects the Atlantic and Pacific Oceans."}},
};

function seededRandom(seed){
  let s=seed;
  return ()=>{ s=(s*1664525+1013904223)&0xffffffff; return (s>>>0)/0xffffffff; };
}

export function pickQuestions(dateStr){
  const keys=Object.keys(BANK);
  let chosen;
  if(dateStr){
    const hash=[...dateStr].reduce((a,c)=>a*31+c.charCodeAt(0),0);
    const rng=seededRandom(hash);
    const shuffled=[...keys].sort(()=>rng()-.5);
    chosen=shuffled.slice(0,5);
  } else {
    const shuffled=[...keys].sort(()=>Math.random()-.5);
    chosen=shuffled.slice(0,5);
  }
  return chosen.map((iso,i)=>({
    id:`q${i+1}-${iso}`,
    n:i+1,
    answer:iso,
    ...BANK[iso],
  }));
}
