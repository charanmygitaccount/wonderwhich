import type { Blueprint } from "./schema";

/**
 * The bundled demo blueprint.
 *
 * This is the exact request the product was designed around -- "I want to sell
 * protein bowls to any address, build a site, market it, get sales, and I don't
 * know anything" -- planned out the way the model is asked to plan it.
 *
 * It exists so the whole product is clickable with no API key and no spend, and
 * so there is a worked example of the quality bar the prompts are aiming at:
 * real screens, real free-tier limits, real numbers, honest about what's hard.
 */
export const SAMPLE_BLUEPRINT: Blueprint = {
  title: "Protein bowls, delivered",
  tagline:
    "A high-protein meal brand you can start from one kitchen and run off your phone.",
  outcome:
    "A live ordering page that takes money and addresses, a repeatable prep routine, and your first 50 paid orders.",
  audience:
    "First-time founder. Can cook. Has never built a website, never run an ad, and wants to start without burning savings.",
  totalTime: "4-6 weekends to first 50 orders",
  tiers: [
    {
      id: "free",
      label: "Zero rupees",
      budget: "$0",
      summary:
        "Instagram + a form + manual payment links. You are the website, the checkout and the support desk.",
      bestFor:
        "Proving people will actually pay before you spend anything at all.",
    },
    {
      id: "lean",
      label: "Lean",
      budget: "~$35/mo + $12 domain",
      summary:
        "A real one-page site on your own domain, automatic card/UPI checkout, and scheduled content.",
      bestFor:
        "You already have a handful of paying customers and manual order-taking is eating your evenings.",
    },
    {
      id: "pro",
      label: "Pro",
      budget: "~$210/mo + ad spend",
      summary:
        "Full store with subscriptions, paid acquisition, and delivery integrated instead of hand-dispatched.",
      bestFor: "Orders are repeating and the constraint is volume, not proof.",
    },
  ],
  phases: [
    {
      id: "p-prove",
      name: "Prove someone pays",
      goal: "Money has changed hands before you have spent any.",
      time: "1 weekend",
      accent: "ember",
    },
    {
      id: "p-kitchen",
      name: "Make it repeatable",
      goal: "You can produce 20 identical bowls without improvising.",
      time: "1 weekend",
      accent: "lime",
    },
    {
      id: "p-storefront",
      name: "Build the storefront",
      goal: "A stranger can order and pay without messaging you.",
      time: "1-2 weekends",
      accent: "teal",
    },
    {
      id: "p-demand",
      name: "Create demand",
      goal: "Orders arrive from people you have never met.",
      time: "2 weekends, then ongoing",
      accent: "violet",
    },
    {
      id: "p-repeat",
      name: "Make it repeat",
      goal: "Last month's customers order again without being chased.",
      time: "Ongoing",
      accent: "sky",
    },
  ],
  tools: [
    {
      id: "claude",
      name: "Claude",
      category: "AI assistant",
      what: "Writes your copy, menu descriptions, ad angles and customer replies.",
      why: "Handles long, structured tasks (a full week of captions in one go) better than asking for one line at a time.",
      freeTier: "Free plan with daily message limits that reset.",
      price: "~$20/mo for Pro",
      url: "https://claude.ai",
      minTier: "free",
      learn: "10 min",
    },
    {
      id: "instagram",
      name: "Instagram",
      category: "Distribution",
      what: "Where food gets discovered, via Reels more than posts.",
      why: "Food is visual and local. Reels reach people who do not follow you yet; a website does not.",
      freeTier: "Free. A business account adds Insights and a contact button.",
      price: "Free",
      url: "https://instagram.com",
      minTier: "free",
      learn: "20 min",
    },
    {
      id: "whatsapp-business",
      name: "WhatsApp Business",
      category: "Orders & support",
      what: "Free business profile, catalogue, saved quick replies, broadcast lists.",
      why: "Your first hundred customers will want to message a human. Quick replies stop that from eating your day.",
      freeTier:
        "Free app. Broadcast lists reach only people who saved your number.",
      price: "Free",
      url: "https://business.whatsapp.com",
      minTier: "free",
      learn: "20 min",
    },
    {
      id: "google-forms",
      name: "Google Forms",
      category: "Order intake",
      what: "A free form that collects name, address, bowl choice and delivery slot into a spreadsheet.",
      why: "It is the fastest way to look like a real ordering system on day one. It cannot take payment.",
      freeTier: "Free, unlimited responses.",
      price: "Free",
      url: "https://forms.google.com",
      minTier: "free",
      learn: "15 min",
    },
    {
      id: "canva",
      name: "Canva",
      category: "Design",
      what: "Menu cards, labels, Reels covers, ad creatives from templates.",
      why: "Templates sized correctly for each platform, so nothing comes out cropped.",
      freeTier:
        "Free plan covers templates and exports. Background remover and brand kit are paid.",
      price: "~$13/mo for Pro",
      url: "https://canva.com",
      minTier: "free",
      learn: "30 min",
    },
    {
      id: "carrd",
      name: "Carrd",
      category: "Website",
      what: "One-page sites, built by dragging blocks. No code.",
      why: "The cheapest way onto your own domain. Deliberately limited, which is why it is fast.",
      freeTier:
        "Three free sites on a carrd.co address. Custom domains need Pro.",
      price: "~$19/year for Pro",
      url: "https://carrd.co",
      minTier: "lean",
      learn: "45 min",
    },
    {
      id: "stripe",
      name: "Stripe Payment Links",
      category: "Payments",
      what: "A hosted checkout page you create without writing code. Collects the delivery address too.",
      why: "A Payment Link is a URL. Any button on any site can point at it, so you are not locked into a platform.",
      freeTier:
        "No monthly fee. Per-transaction cut (~2.9% + 30c, varies by country).",
      price: "Per transaction",
      url: "https://stripe.com/payments/payment-links",
      minTier: "lean",
      learn: "30 min",
    },
    {
      id: "razorpay",
      name: "Razorpay Payment Pages",
      category: "Payments",
      what: "India-facing equivalent of Payment Links, with UPI built in.",
      why: "If your customers are in India, UPI is most of your volume and card-first checkouts lose orders.",
      freeTier: "No monthly fee. Per-transaction cut (~2%).",
      price: "Per transaction",
      url: "https://razorpay.com",
      minTier: "lean",
      learn: "30 min",
    },
    {
      id: "meta-ads",
      name: "Meta Ads Manager",
      category: "Paid acquisition",
      what: "Runs paid Instagram and Facebook ads to a radius around your kitchen.",
      why: "Radius targeting is the whole point for a delivery business. Boosting a post from the app does not give you it properly.",
      freeTier: "No platform fee. You pay for the ads.",
      price: "From ~$5/day",
      url: "https://adsmanager.facebook.com",
      minTier: "pro",
      learn: "2 hours",
    },
    {
      id: "google-business",
      name: "Google Business Profile",
      category: "Local discovery",
      what: "Puts you on Google Maps and in 'protein bowls near me' results.",
      why: "Free, high-intent, and most food startups never bother. Needs a service-area setup, not a storefront.",
      freeTier: "Free.",
      price: "Free",
      url: "https://business.google.com",
      minTier: "free",
      learn: "40 min",
    },
    {
      id: "shopify",
      name: "Shopify",
      category: "Store",
      what: "Full store with inventory, delivery zones, discount codes and subscription apps.",
      why: "Worth it only once repeat orders and subscriptions are the bottleneck. Before that it is overhead.",
      freeTier: "Trial only, then paid.",
      price: "~$39/mo plus app fees",
      url: "https://shopify.com",
      minTier: "pro",
      learn: "4 hours",
    },
    {
      id: "capcut",
      name: "CapCut",
      category: "Video",
      what: "Edits Reels on your phone: captions, trims, trending audio.",
      why: "Auto-captions matter because most food Reels are watched with sound off.",
      freeTier:
        "Free for the editing you need. Some effects and exports are Pro.",
      price: "~$8/mo for Pro",
      url: "https://capcut.com",
      minTier: "free",
      learn: "30 min",
    },
  ],
  steps: [
    {
      id: "s1",
      phase: "p-prove",
      title: "Pick one customer and one bowl",
      why: "A menu of nine bowls for everyone is how you end up cooking nine things and selling none.",
      outcome: "One sentence naming who it is for and what they get.",
      time: "45 min",
      effort: 1,
      dependsOn: [],
      variants: {
        free: {
          tools: ["claude"],
          cost: "$0",
          tradeoff:
            "Costs an afternoon of thinking instead of money. Nothing here needs a paid tool.",
          actions: [
            {
              app: "Claude",
              where: "New chat",
              do: "Paste the prompt in the box below and answer its questions honestly",
              detail:
                "You are looking for one specific person, not a demographic. 'Gym-goers aged 20-35' is not specific. 'People who train at the 6am slot at the gym two streets away and skip breakfast' is.",
              paste:
                "I want to sell high-protein bowls, oatmeal and shakes, delivered. Interview me: ask one question at a time, up to 8 questions, about who I already know who eats like this, where they are, what they currently eat instead, and what they pay for it now. Then give me three candidate customer definitions, each one sentence, ranked by how easy they are for me to reach in the first month without spending money. Be blunt about which ones are fantasy.",
            },
            {
              app: "Notes app",
              where: "A new note",
              do: "Write your one sentence in the form: 'X who Y, get Z, for the price of W'",
              detail:
                "Example: 'People training at the 6am slot who skip breakfast get a 35g-protein bowl at their door by 7:15am for the price of a coffee and a croissant.'",
              paste: null,
            },
          ],
          doneWhen: [
            "The sentence names a place you could physically walk to.",
            "You can name three real people who fit it.",
            "The menu is one bowl, not a menu.",
          ],
          pitfalls: [
            "Choosing 'everyone who wants to be healthy' because it feels bigger. It is the fastest way to zero orders.",
            "Letting the AI pick for you. It has never met your neighbours; it can only sharpen what you feed it.",
          ],
        },
        lean: {
          tools: ["claude"],
          cost: "$0",
          tradeoff:
            "Identical to free. There is nothing here worth paying for.",
          actions: [
            {
              app: "Claude",
              where: "New chat",
              do: "Run the same interview prompt, then pressure-test the winner",
              detail:
                "The second prompt is the one that saves money later -- it kills weak ideas before you have bought a domain for them.",
              paste:
                "Here is my customer definition: [paste yours]. Argue against it. What has to be true for this to work? Which of those assumptions is most likely false, and what is the cheapest way to test that one this week without spending money?",
            },
          ],
          doneWhen: [
            "You have written down the one assumption most likely to kill this.",
            "You know how you will test it in the next seven days.",
          ],
          pitfalls: [
            "Treating the critique as discouragement. It is a list of things to test, not a verdict.",
          ],
        },
        pro: {
          tools: ["claude"],
          cost: "$0",
          tradeoff:
            "Same work. At this tier you also size the market, because you will be spending on ads against it.",
          actions: [
            {
              app: "Claude",
              where: "New chat",
              do: "Run the interview, then size the delivery radius",
              detail:
                "Paid acquisition only works if enough people live inside the area you can actually deliver to in time.",
              paste:
                "My customer is: [paste]. My kitchen is at [area]. I can deliver within [X] km in under 40 minutes. Estimate how many people plausibly fit my customer definition in that radius, show your reasoning and your assumptions, and tell me what monthly order volume would be realistic at 1%, 3% and 5% reach. Flag which assumptions I should verify myself rather than trust from you.",
            },
          ],
          doneWhen: [
            "You have a rough count of reachable customers and the assumptions behind it.",
            "You know what volume is realistic before you spend on ads.",
          ],
          pitfalls: [
            "Taking the AI's population estimate as fact. It is a starting hypothesis -- check it against a map and a walk around the area.",
          ],
        },
      },
    },
    {
      id: "s2",
      phase: "p-prove",
      title: "Price it so it actually makes money",
      why: "Most food startups die at unit economics, not at marketing. You find out at order 300 or at order 3.",
      outcome:
        "A cost sheet showing what one bowl costs you and what it must sell for.",
      time: "1 hour",
      effort: 2,
      dependsOn: ["s1"],
      variants: {
        free: {
          tools: ["claude"],
          cost: "$0",
          tradeoff: "A spreadsheet you maintain by hand. Fine at this volume.",
          actions: [
            {
              app: "Google Sheets",
              where: "sheets.new in your browser",
              do: "Make columns: Ingredient, Qty per bowl, Pack price, Pack size, Cost per bowl",
              detail:
                "Cost per bowl = Qty ÷ Pack size × Pack price. Weigh things once; do not estimate. Chicken and nuts will surprise you.",
              paste: "=D2/E2*C2",
            },
            {
              app: "Google Sheets",
              where: "Below the ingredient rows",
              do: "Add rows for packaging, delivery, payment fee and wastage",
              detail:
                "Wastage is real: budget 10% until you have data. Delivery is the line that quietly kills margins -- put the true number in, not the one you hope for.",
              paste: null,
            },
            {
              app: "Claude",
              where: "New chat",
              do: "Sanity-check the sheet before you trust it",
              detail:
                "Paste your numbers in and let it hunt for what you forgot.",
              paste:
                "Here is my per-bowl cost sheet: [paste]. I sell at [price]. Find costs I have forgotten for a home-kitchen food delivery business. Then tell me my contribution margin per bowl and how many bowls a week I need to cover [your monthly fixed costs]. Be pessimistic.",
            },
          ],
          doneWhen: [
            "Every ingredient row came from a real pack price you looked up, not memory.",
            "Contribution margin per bowl is positive after packaging, delivery and payment fees.",
            "You know your break-even bowls per week as a number.",
          ],
          pitfalls: [
            "Forgetting your own labour. Put a number on it even if you do not pay yourself yet, or you will scale a business that cannot hire.",
            "Pricing off what competitors charge without knowing whether they are profitable.",
          ],
        },
        lean: {
          tools: ["claude"],
          cost: "$0",
          tradeoff:
            "Same sheet, plus discount and bundle modelling so promos do not eat the margin.",
          actions: [
            {
              app: "Google Sheets",
              where: "A second tab named 'Scenarios'",
              do: "Model single bowl, 5-bowl pack and weekly subscription side by side",
              detail:
                "Packs raise order value and cut per-order delivery cost. They are usually the difference between a hobby and a business.",
              paste: null,
            },
            {
              app: "Claude",
              where: "New chat",
              do: "Stress-test your discounts",
              detail:
                "A 20% launch discount can put you underwater without you noticing.",
              paste:
                "My per-bowl cost is [X] and price is [Y]. Model what happens to my margin at 10%, 20% and 30% launch discounts, and at a 5-bowl bundle priced at [Z]. At what discount do I start losing money per order once delivery and payment fees are included?",
            },
          ],
          doneWhen: [
            "You know the deepest discount you can offer and still make money.",
            "Bundle pricing is set and it beats single-bowl margin.",
          ],
          pitfalls: [
            "Launching a discount before you know your floor, then being unable to raise prices later without losing the customers it bought.",
          ],
        },
        pro: {
          tools: ["claude"],
          cost: "$0",
          tradeoff:
            "Adds customer acquisition cost, because at this tier you are buying customers.",
          actions: [
            {
              app: "Google Sheets",
              where: "A third tab named 'Unit economics'",
              do: "Add rows for ad spend per order, repeat rate and 90-day customer value",
              detail:
                "The number that matters is what a customer is worth over 90 days versus what an ad had to pay to get them. A single order almost never pays for its own ad.",
              paste: null,
            },
            {
              app: "Claude",
              where: "New chat",
              do: "Work out the most you can pay for a customer",
              detail: "This becomes the hard ceiling on your ad bidding later.",
              paste:
                "Average order value [X], contribution margin [Y]%, and I expect a customer to order [N] times in 90 days. What is the maximum I can pay to acquire one customer and still be profitable within 90 days? Show the calculation and tell me what repeat rate I need for paid ads to work at all.",
            },
          ],
          doneWhen: [
            "You have a maximum cost-per-acquisition written down.",
            "You know the repeat rate that makes ads viable, and it is a number you can check later.",
          ],
          pitfalls: [
            "Running ads before this number exists. You will not know whether they are working until the money is gone.",
          ],
        },
      },
    },
    {
      id: "s3",
      phase: "p-prove",
      title: "Take 10 pre-orders before you cook anything",
      why: "This is the only step that tells you the truth. Everything before it is opinion.",
      outcome:
        "Ten people who have paid, or committed to pay, for a specific delivery date.",
      time: "3 hours, spread over a week",
      effort: 3,
      dependsOn: ["s1", "s2"],
      variants: {
        free: {
          tools: ["whatsapp-business", "google-forms", "canva", "claude"],
          cost: "$0",
          tradeoff:
            "You collect money by hand, one conversation at a time. It does not scale, and at ten orders it does not need to.",
          actions: [
            {
              app: "Canva",
              where: "Home → search 'Instagram Story' → pick a plain template",
              do: "Make one image: the bowl, the protein number, the price, the delivery date",
              detail:
                "One image, four facts. Shoot the bowl on a plain surface near a window. Do not add a logo yet -- you do not have a brand, you have an offer.",
              paste: null,
            },
            {
              app: "Google Forms",
              where: "forms.new → Blank form",
              do: "Add fields: Name, WhatsApp number, Delivery address, Bowl choice, Delivery date, Paid? (Yes/No)",
              detail:
                "Under Settings, turn on 'Collect email addresses' only if you will actually use them. Every extra field costs you orders.",
              paste: null,
            },
            {
              app: "WhatsApp Business",
              where: "Your own chats, one at a time",
              do: "Send the image and the form link to 30 people individually",
              detail:
                "Individually. Not a broadcast, not a status. Expect roughly a third to reply and a third of those to buy -- that is how you get to ten.",
              paste:
                "Hey [name] -- I'm starting a high-protein bowl thing, delivered to your door. [Protein]g protein, [price], first deliveries on [date]. You came to mind because you [specific reason]. Want one? No pressure if not, but I'd genuinely value you telling me why not.",
            },
            {
              app: "WhatsApp Business",
              where:
                "Settings → Business tools → Payments, or your own UPI/bank details",
              do: "Collect payment on confirmation, before you shop for ingredients",
              detail:
                "Taking the money now is the whole test. 'I'd definitely buy' is not data; a completed payment is.",
              paste: null,
            },
          ],
          doneWhen: [
            "Ten people have paid or committed to a named delivery date.",
            "The addresses are all inside a radius you can actually deliver.",
            "You have written down, verbatim, why the people who said no said no.",
          ],
          pitfalls: [
            "Accepting 'sounds great, send me the link' as a yes. It is a polite no until money moves.",
            "Posting once to your Story instead of messaging people one by one. Stories get views; messages get orders.",
            "Discounting for friends. You will learn nothing about whether the price works.",
          ],
        },
        lean: {
          tools: ["stripe", "razorpay", "google-forms", "canva", "claude"],
          cost: "Transaction fees only",
          tradeoff:
            "A real checkout link means people can pay at 11pm without you. Costs ~2-3% per order.",
          actions: [
            {
              app: "Stripe",
              where: "Dashboard → Payment links → Create payment link",
              do: "Create a link for one bowl, and turn on collecting the shipping address",
              detail:
                "In the link options, enable address collection so the delivery address arrives with the payment instead of in a separate message. Use Razorpay Payment Pages instead if your customers are in India -- UPI matters more than cards there.",
              paste: null,
            },
            {
              app: "Canva",
              where: "Your story template",
              do: "Put the payment link in your Instagram bio and reply to every comment with it",
              detail:
                "Links are not clickable in Instagram captions. Bio link, or reply in DMs -- anything else and people simply will not reach the checkout.",
              paste: null,
            },
          ],
          doneWhen: [
            "Someone you have never met has paid through the link without messaging you first.",
            "Addresses arrive attached to payments, not scattered across chats.",
          ],
          pitfalls: [
            "Forgetting to enable address collection and spending your evening asking 30 people where they live.",
            "Card-only checkout in a UPI-first market. You will lose most of the orders and never know why.",
          ],
        },
        pro: {
          tools: ["stripe", "shopify", "claude"],
          cost: "~$39/mo",
          tradeoff:
            "Skips the manual stage entirely. Only worth it if you already know people pay -- otherwise you are paying rent on an empty shop.",
          actions: [
            {
              app: "Shopify",
              where: "Products → Add product",
              do: "Create the bowl as a product with variants for size and protein level",
              detail:
                "Set it to a single delivery zone first. Do not switch on nationwide shipping for a fresh-food product.",
              paste: null,
            },
            {
              app: "Shopify",
              where: "Settings → Shipping and delivery → Local delivery",
              do: "Turn on local delivery for your postcodes with a minimum order value",
              detail:
                "Local delivery is the correct setting for fresh food, not standard shipping. It gates checkout to addresses you can reach.",
              paste: null,
            },
          ],
          doneWhen: [
            "A test order goes through end to end and lands in the Orders tab.",
            "Checkout refuses an address outside your delivery zone.",
          ],
          pitfalls: [
            "Building the full store before you have proof. It is the most expensive way to avoid asking people for money.",
          ],
        },
      },
    },
    {
      id: "s4",
      phase: "p-kitchen",
      title: "Get legal before you get popular",
      why: "A food licence is cheap and boring right up until a customer asks for one, or you want to list on a delivery platform.",
      outcome:
        "Registration applied for, and the certificate number where you can find it.",
      time: "2 hours plus waiting",
      effort: 2,
      dependsOn: ["s3"],
      variants: {
        free: {
          tools: ["claude"],
          cost: "Registration fee only (usually small)",
          tradeoff: "You do the paperwork yourself. It is tedious, not hard.",
          actions: [
            {
              app: "Your country's food safety authority website",
              where: "The registration or licensing section",
              do: "Apply for the smallest category that covers a home or cloud kitchen at your turnover",
              detail:
                "Rules differ by country and by state, and they change. Find the official government site rather than a blog summarising it -- FSSAI in India, your local council or health department in the UK, US and most of the EU.",
              paste: null,
            },
            {
              app: "Claude",
              where: "New chat",
              do: "Get a checklist of what you will be asked for",
              detail:
                "Use this to gather documents in one sitting instead of discovering each requirement mid-form. Verify anything it tells you against the official site -- this is exactly where a confident wrong answer costs you.",
              paste:
                "I am starting a home-kitchen food delivery business in [city, country], expecting under [X] revenue in year one. List the registrations, licences and documents I am likely to need, what each one is for, and the rough cost and timeline. For each item, tell me the official government website I should verify it on. Flag anything that varies by local authority.",
            },
          ],
          doneWhen: [
            "Application submitted and the reference number saved.",
            "You know your renewal date.",
          ],
          pitfalls: [
            "Relying on an AI summary of food law. Use it to build the checklist, then confirm every item on the official site.",
            "Putting this off until a delivery platform asks. They will not onboard you without it.",
          ],
        },
        lean: {
          tools: ["claude"],
          cost: "Registration fee only",
          tradeoff:
            "Same, plus the insurance conversation you will otherwise have after an incident.",
          actions: [
            {
              app: "Your food safety authority website",
              where: "Registration section",
              do: "Apply, and separately get a quote for public liability or product liability cover",
              detail:
                "One allergic reaction is a business-ending event without cover. Quotes are usually free and take ten minutes.",
              paste: null,
            },
          ],
          doneWhen: [
            "Registration submitted.",
            "You have at least one written insurance quote to compare.",
          ],
          pitfalls: [
            "Assuming home contents insurance covers a food business. It does not.",
          ],
        },
        pro: {
          tools: ["claude"],
          cost: "Registration + insurance + possible kitchen rent",
          tradeoff:
            "Commercial kitchen hire unlocks volume and platform listings, and adds a fixed monthly cost.",
          actions: [
            {
              app: "Local cloud kitchen operators",
              where: "Enquiry form or a site visit",
              do: "Price a shared commercial kitchen slot against your home setup",
              detail:
                "Ask specifically what licences the operator already holds and what you still need in your own name. Some cover you; most do not.",
              paste: null,
            },
          ],
          doneWhen: [
            "You have a written monthly cost for kitchen space.",
            "You know exactly which licences transfer and which do not.",
          ],
          pitfalls: [
            "Signing a kitchen lease before repeat orders exist. Fixed costs are what turn a slow month into a fatal one.",
          ],
        },
      },
    },
    {
      id: "s5",
      phase: "p-kitchen",
      title: "Build a prep routine you can repeat at 5am",
      why: "The first ten bowls are fun. The next two hundred are a process, and inconsistency is what loses repeat customers.",
      outcome:
        "A written prep sheet and packaging that survives a 30-minute bike ride.",
      time: "One cook-through",
      effort: 2,
      dependsOn: ["s3"],
      variants: {
        free: {
          tools: ["claude", "canva"],
          cost: "Ingredients + containers",
          tradeoff:
            "Handwritten labels and supermarket containers. Looks homemade, because it is.",
          actions: [
            {
              app: "Claude",
              where: "New chat",
              do: "Turn your recipe into a batch prep sheet",
              detail:
                "You want timings and an order of operations, not a recipe. What can be made the night before is the difference between a 4am and a 6am start.",
              paste:
                "Here is my bowl recipe for one portion: [paste]. Turn it into a batch prep sheet for 20 portions. Give me: a shopping list with quantities, what can be prepped the night before versus what must be fresh, an order of operations with timings working backwards from a 7am delivery, and the food safety points that matter for holding and transporting each component. Call out anything that will go soggy.",
            },
            {
              app: "Your kitchen",
              where: "A full test run",
              do: "Cook 5 bowls, pack them, and leave one on the counter for 40 minutes",
              detail:
                "Then eat it. That is what your customer gets. Sauce touching greens is the classic failure -- separate container or it arrives wilted.",
              paste: null,
            },
          ],
          doneWhen: [
            "The 40-minute bowl was still good.",
            "You know your real cost per bowl from actual receipts, not estimates.",
            "The prep sheet is printed and on the wall.",
          ],
          pitfalls: [
            "Packing hot food in a sealed container. It steams and arrives soggy -- cool it first.",
            "Skipping the sit-and-eat test. Every delivery food failure is discovered by a customer if you do not discover it first.",
          ],
        },
        lean: {
          tools: ["claude", "canva"],
          cost: "~$40 one-off for printed labels and better containers",
          tradeoff:
            "Printed labels with ingredients and allergens. Looks like a brand and covers you legally.",
          actions: [
            {
              app: "Canva",
              where: "Home → Custom size → set your label dimensions",
              do: "Design a label with name, ingredients, allergens, made-on date and your handle",
              detail:
                "Allergens are usually a legal requirement, not a nicety. Check the format your country requires -- many mandate bold or highlighted allergen text.",
              paste: null,
            },
            {
              app: "Local print shop or an online label printer",
              where: "Upload artwork",
              do: "Order 200 sticker labels",
              detail:
                "Order the smallest run you can. Your recipe will change within a month and you do not want 2,000 obsolete stickers.",
              paste: null,
            },
          ],
          doneWhen: [
            "Labels list every allergen in the required format.",
            "A bowl arrives looking like something you would pay for.",
          ],
          pitfalls: [
            "Printing 2,000 labels to save per-unit cost, then changing the recipe.",
          ],
        },
        pro: {
          tools: ["claude", "canva"],
          cost: "~$150/mo for packaging at volume",
          tradeoff:
            "Custom packaging and a second pair of hands. Buys back your mornings.",
          actions: [
            {
              app: "Packaging supplier",
              where: "Request a quote with your volumes",
              do: "Price branded containers and sleeves at 500 and 1,000 units",
              detail:
                "Ask for samples before committing. Leak-proof at an angle is the spec that matters for bikes -- test it with a full bowl tilted 45 degrees.",
              paste: null,
            },
            {
              app: "Your kitchen",
              where: "Prep station",
              do: "Write the prep sheet so someone else can follow it without asking you anything",
              detail:
                "This is the document you hand a helper. If it needs a phone call to interpret, it is not finished.",
              paste: null,
            },
          ],
          doneWhen: [
            "Someone else produced 20 bowls from your sheet without calling you.",
            "Packaging survived a tilt test with sauce in it.",
          ],
          pitfalls: [
            "Ordering 1,000 branded containers before the menu has settled.",
          ],
        },
      },
    },
    {
      id: "s6",
      phase: "p-storefront",
      title: "Shoot the food so it sells itself",
      why: "People buy food with their eyes, and a bad photo undoes a good bowl. This is the highest-leverage hour in the plan.",
      outcome: "Six usable photos and two short videos of the same bowl.",
      time: "2 hours",
      effort: 2,
      dependsOn: ["s5"],
      variants: {
        free: {
          tools: ["canva", "capcut", "claude"],
          cost: "$0",
          tradeoff:
            "Phone camera and a window. Genuinely enough if you get the light right.",
          actions: [
            {
              app: "Your phone camera",
              where: "A table beside a window, mid-morning",
              do: "Shoot the bowl from directly overhead, at a 45-degree angle, and close enough to see texture",
              detail:
                "Window light from the side, never the flash and never overhead kitchen bulbs. A white sheet of paper opposite the window bounces light back and removes the harsh shadow. Shoot 30 frames, keep 6.",
              paste: null,
            },
            {
              app: "Your phone camera",
              where: "Same setup, video mode",
              do: "Film two 8-second clips: sauce being poured, and the first forkful lifted",
              detail:
                "Motion and steam outperform still photos on Reels every time. Film in slow motion if your phone offers it.",
              paste: null,
            },
            {
              app: "CapCut",
              where: "New project → import clips → Captions → Auto captions",
              do: "Cut the clips together and burn in captions",
              detail:
                "Most food video is watched on mute. No captions, no message. Keep the whole thing under 15 seconds.",
              paste: null,
            },
          ],
          doneWhen: [
            "Six photos where the food looks like it does in real life, only better lit.",
            "One vertical video under 15 seconds with readable captions.",
          ],
          pitfalls: [
            "Shooting at night under kitchen lights. It turns food grey and nothing in editing fixes it.",
            "Over-editing the colour until the bowl looks unreal. Customers notice the gap on arrival.",
          ],
        },
        lean: {
          tools: ["canva", "capcut", "claude"],
          cost: "~$13/mo",
          tradeoff:
            "Canva Pro's background remover and brand kit make everything consistent quickly.",
          actions: [
            {
              app: "Canva",
              where: "Open a photo → Edit photo → Background remover",
              do: "Cut the bowl out and place it on your brand colour for menu cards and ads",
              detail:
                "One cut-out bowl on a flat colour is the most reusable asset you will make -- it works as an ad, a menu item and a story.",
              paste: null,
            },
            {
              app: "Canva",
              where: "Brand kit",
              do: "Set two colours and one font and never deviate",
              detail:
                "Consistency is what makes a one-person operation look like a company.",
              paste: null,
            },
          ],
          doneWhen: [
            "Every asset uses the same two colours and one font.",
            "You have a cut-out bowl image ready to drop into anything.",
          ],
          pitfalls: [
            "Choosing a script font for a price. If it is not readable at thumbnail size it is not a font, it is decoration.",
          ],
        },
        pro: {
          tools: ["canva", "capcut"],
          cost: "~$200 one-off",
          tradeoff:
            "A half-day with a food photographer. Expensive once, then reused in every ad for a year.",
          actions: [
            {
              app: "Instagram",
              where:
                "Search local food photographers and check their tagged work",
              do: "Book a half-day and shoot all menu items in one session",
              detail:
                "Ask for vertical crops explicitly -- photographers default to landscape and every platform you care about is vertical.",
              paste: null,
            },
          ],
          doneWhen: [
            "You have 20+ images and 10 clips, all vertical, all usable as ad creative.",
          ],
          pitfalls: [
            "Paying for a shoot before the menu is final. You will reshoot.",
          ],
        },
      },
    },
    {
      id: "s7",
      phase: "p-storefront",
      title: "Put up a page that takes orders while you sleep",
      why: "Until a stranger can order without talking to you, you do not have a business, you have a job answering messages.",
      outcome:
        "A live page with a menu, prices, a delivery area and a working pay button.",
      time: "3 hours",
      effort: 2,
      dependsOn: ["s6"],
      variants: {
        free: {
          tools: ["google-forms", "instagram", "whatsapp-business"],
          cost: "$0",
          tradeoff:
            "A form link in your bio rather than a website. Looks improvised, works fine, costs nothing.",
          actions: [
            {
              app: "Google Forms",
              where: "Your order form → the palette icon in the top bar",
              do: "Set a header image using your best bowl photo and match the colour",
              detail:
                "A form with a real photo at the top converts noticeably better than the default purple. Small change, free.",
              paste: null,
            },
            {
              app: "Google Forms",
              where:
                "Settings → Responses → turn on 'Get email notifications for new responses'",
              do: "Switch on notifications so orders reach you immediately",
              detail:
                "Without this you will find an order eleven hours after someone placed it. That customer does not come back.",
              paste: null,
            },
            {
              app: "Instagram",
              where: "Profile → Edit profile → Links → Add external link",
              do: "Put the form link in your bio with a one-line description",
              detail:
                "Your bio line should say what you sell, where you deliver and when. 'Founder. Dreamer.' sells nothing.",
              paste: null,
            },
          ],
          doneWhen: [
            "A friend ordered from the link without asking you a single question.",
            "A new order pings your phone within seconds.",
          ],
          pitfalls: [
            "A form with fifteen fields. Every field loses orders -- five is plenty.",
            "Not stating the delivery area on the form, then having to refund people out of range.",
          ],
        },
        lean: {
          tools: ["carrd", "stripe", "razorpay", "canva"],
          cost: "~$19/yr + ~$12 domain",
          tradeoff:
            "Your own domain and a real checkout. This is the step where it starts feeling like a company.",
          actions: [
            {
              app: "Carrd",
              where: "Start → choose a one-page template → Sections",
              do: "Build five blocks: hero photo, the bowl and price, how delivery works, delivery area, pay button",
              detail:
                "One page, one button, repeated twice. Resist adding an About page -- nobody is reading your origin story before their first order.",
              paste: null,
            },
            {
              app: "Carrd",
              where: "The button element → Link → paste your payment link",
              do: "Point the button at your Stripe or Razorpay link",
              detail:
                "Test it yourself with a real card or UPI, then refund it. An untested pay button is the single most expensive bug in this whole plan.",
              paste: null,
            },
            {
              app: "Your domain registrar",
              where: "DNS settings for your domain",
              do: "Add the records Carrd shows you on its publish screen",
              detail:
                "Carrd prints the exact record type and values when you add a custom domain -- copy them literally. DNS changes usually appear within an hour but can take a day.",
              paste: null,
            },
          ],
          doneWhen: [
            "Your domain loads the page on someone else's phone, not just yours.",
            "A real payment went through and you refunded it.",
            "The delivery area is stated above the pay button, not below it.",
          ],
          pitfalls: [
            "Buying a domain with a hyphen or a creative spelling. You will spell it out loud a thousand times.",
            "Publishing without testing on a phone. Most of your traffic is a phone.",
          ],
        },
        pro: {
          tools: ["shopify", "stripe"],
          cost: "~$39/mo + apps",
          tradeoff:
            "Real store: subscriptions, discount codes, delivery slots, abandoned-cart recovery.",
          actions: [
            {
              app: "Shopify",
              where:
                "Settings → Shipping and delivery → Local delivery → set postcodes and minimum order",
              do: "Define your delivery zone and a delivery fee that reflects real cost",
              detail:
                "Free delivery below a sensible minimum is the quiet way to lose money on every order.",
              paste: null,
            },
            {
              app: "Shopify App Store",
              where: "Search 'subscriptions'",
              do: "Install a subscription app and create a weekly 5-bowl plan",
              detail:
                "Subscriptions are the entire reason to be on Shopify for a food business. Compare two apps on transaction fees before installing.",
              paste: null,
            },
          ],
          doneWhen: [
            "A test subscription renews correctly in the app's test mode.",
            "Checkout blocks out-of-zone addresses automatically.",
          ],
          pitfalls: [
            "Installing six apps at $15/mo each. That is $90/mo of margin before you have sold anything.",
          ],
        },
      },
    },
    {
      id: "s8",
      phase: "p-demand",
      title: "Run the content engine for 30 days",
      why: "Organic content is the only acquisition channel that costs nothing but time, and it compounds. It also fails quietly if you post whenever you feel like it.",
      outcome: "A month of posts scheduled, and a format that works.",
      time: "3 hours to set up, 20 min/day",
      effort: 2,
      dependsOn: ["s6", "s7"],
      variants: {
        free: {
          tools: ["instagram", "capcut", "claude", "canva"],
          cost: "$0",
          tradeoff:
            "You post manually every day. The discipline is the hard part, not the tools.",
          actions: [
            {
              app: "Claude",
              where: "New chat",
              do: "Generate 30 days of post ideas mapped to formats",
              detail:
                "Ask for formats, not captions. The hook in the first two seconds decides whether a Reel travels.",
              paste:
                "I sell high-protein bowls delivered in [city] to [customer from step 1]. Give me 30 days of Instagram content as a table: day, format (Reel/carousel/story), hook line for the first 2 seconds, what to film or photograph, and the caption. Mix these buckets: the food being made, the customer problem (no time, no protein), behind the scenes of a one-person kitchen, customer reactions, and price/value explainers. Hooks must be specific -- no 'you won't believe'. Write captions in a plain, direct voice, no emoji walls, no hashtag spam.",
            },
            {
              app: "Instagram",
              where:
                "Your profile → Edit profile → switch to a professional account",
              do: "Turn on a business account so you get Insights",
              detail:
                "Without Insights you cannot see which Reel actually drove profile visits, and you will optimise for likes instead of orders.",
              paste: null,
            },
            {
              app: "CapCut",
              where: "Batch edit session",
              do: "Film and cut a week of Reels in one sitting",
              detail:
                "Batching is what makes daily posting survivable. Film six, edit six, post one a day.",
              paste: null,
            },
          ],
          doneWhen: [
            "Seven Reels sit finished on your phone before the week starts.",
            "You have posted 14 days without a gap.",
            "You can name which post brought the most profile visits.",
          ],
          pitfalls: [
            "Posting beautiful food with no hook. Pretty is not a reason to stop scrolling.",
            "Quitting at day nine because nothing has happened. Nine days is not a test.",
            "Never asking for the order. Roughly every third post should say how to buy.",
          ],
        },
        lean: {
          tools: ["instagram", "capcut", "canva", "claude"],
          cost: "~$21/mo",
          tradeoff:
            "Scheduling plus Canva Pro. Removes the daily 'I must post' pressure.",
          actions: [
            {
              app: "Instagram",
              where: "Create a Reel → Advanced settings → Schedule",
              do: "Schedule a week of Reels in one session",
              detail:
                "Instagram schedules natively now, so you do not need a separate paid scheduler at this size.",
              paste: null,
            },
            {
              app: "Claude",
              where: "New chat, weekly",
              do: "Feed last week's numbers back in and ask what to change",
              detail:
                "This is the loop most people skip -- posting without reading the data is guessing on a schedule.",
              paste:
                "Here are last week's Instagram metrics per post: [paste views, profile visits, link clicks]. Which formats and hooks drove profile visits rather than just views? What should I do more of, and what should I stop? Give me next week's 7 posts based on what actually worked, not on general best practice.",
            },
          ],
          doneWhen: [
            "Next week is scheduled before this week ends.",
            "You changed one thing based on data rather than a hunch.",
          ],
          pitfalls: [
            "Scheduling a month then never reviewing performance. Scheduling is not strategy.",
          ],
        },
        pro: {
          tools: ["instagram", "capcut", "canva", "claude"],
          cost: "~$21/mo + creator fees",
          tradeoff:
            "Local micro-creators post for you. Borrowed audiences beat building your own from zero.",
          actions: [
            {
              app: "Instagram",
              where:
                "Search local food and fitness accounts with 5k-30k followers in your city",
              do: "Offer free bowls for a week in exchange for two Reels",
              detail:
                "Small local accounts convert far better than big national ones. Ask for the raw footage too so you can reuse it in ads.",
              paste:
                "Hi [name] -- I run [brand], high-protein bowls delivered in [area]. I'd like to send you a week of bowls, free, no strings. If you like them, two Reels would mean a lot. If you don't, tell me why and I'll take the feedback. Either way the food is yours.",
            },
          ],
          doneWhen: [
            "Three creators have posted about you.",
            "You have their footage saved for ad use, with permission.",
          ],
          pitfalls: [
            "Paying for a big account with a national audience that cannot order from you.",
            "Using creator footage in paid ads without written permission.",
          ],
        },
      },
    },
    {
      id: "s9",
      phase: "p-demand",
      title: "Get found by people already searching",
      why: "Someone typing 'healthy meal delivery near me' is ready to buy. This traffic is free and almost nobody claims it.",
      outcome: "You appear on Maps for your area with photos and real reviews.",
      time: "1 hour plus verification wait",
      effort: 1,
      dependsOn: ["s7"],
      variants: {
        free: {
          tools: ["google-business", "claude"],
          cost: "$0",
          tradeoff:
            "Free and slow. Verification can take days, so start it early.",
          actions: [
            {
              app: "Google Business Profile",
              where: "business.google.com → Manage now → add your business",
              do: "Create the profile as a service-area business, not a storefront",
              detail:
                "Choose the option for delivering to customers rather than serving them at an address, then list the areas you deliver to. This hides your home address, which matters if you cook from home.",
              paste: null,
            },
            {
              app: "Google Business Profile",
              where: "Your profile → Photos",
              do: "Upload your six food photos and set your hours and website link",
              detail:
                "Profiles with photos get materially more clicks. Add new photos monthly -- activity is a ranking signal.",
              paste: null,
            },
            {
              app: "WhatsApp Business",
              where: "Message customers two days after delivery",
              do: "Ask every happy customer for a review, with the direct link",
              detail:
                "Reviews are the ranking lever. Ask within 48 hours while the meal is still a memory, and send the link -- 'search for us on Google' converts far worse.",
              paste:
                "Hey [name] -- glad the bowls landed well. If you have 30 seconds, a quick Google review genuinely helps people nearby find us: [link]. And if anything was off, tell me instead and I'll fix it.",
            },
          ],
          doneWhen: [
            "The profile is verified and appears when you search your business name.",
            "Five reviews are live.",
            "Your delivery areas are listed correctly.",
          ],
          pitfalls: [
            "Listing a home address publicly. Use the service-area option instead.",
            "Buying reviews. Google removes them and can suspend the profile.",
          ],
        },
        lean: {
          tools: ["google-business", "claude"],
          cost: "$0",
          tradeoff: "Same work, plus posting weekly offers to the profile.",
          actions: [
            {
              app: "Google Business Profile",
              where: "Your profile → Add update / offer",
              do: "Post a weekly offer or new menu item",
              detail:
                "These show in search results and signal an active business. Two minutes a week.",
              paste: null,
            },
          ],
          doneWhen: ["You have posted an update four weeks running."],
          pitfalls: [
            "Setting it up once and never touching it again -- activity is part of the ranking.",
          ],
        },
        pro: {
          tools: ["google-business"],
          cost: "Platform commission (typically 15-30%)",
          tradeoff:
            "Delivery platforms bring volume and take a painful cut. Run the margin first.",
          actions: [
            {
              app: "A delivery platform's partner portal",
              where: "Restaurant partner signup",
              do: "Apply, but list platform-only pricing that absorbs the commission",
              detail:
                "Never list the same price you charge direct. Work out the commission on your sheet from step 2 before you sign anything.",
              paste: null,
            },
          ],
          doneWhen: [
            "Platform pricing keeps your margin positive after commission.",
            "You have a way to convert platform customers to direct orders.",
          ],
          pitfalls: [
            "Listing at direct-order prices and quietly losing money on every platform order.",
          ],
        },
      },
    },
    {
      id: "s10",
      phase: "p-demand",
      title: "Spend your first $100 on ads, properly",
      why: "Ads are the fastest way to find out whether strangers want this. They are also the fastest way to waste money if the offer is not proven.",
      outcome: "A radius-targeted campaign with a cost per order you can read.",
      time: "3 hours",
      effort: 3,
      dependsOn: ["s7", "s8"],
      variants: {
        free: {
          tools: ["instagram", "whatsapp-business"],
          cost: "$0",
          tradeoff:
            "No ad spend. You trade money for legwork: gyms, offices, building groups. Slower, and it teaches you more.",
          actions: [
            {
              app: "In person",
              where:
                "Gyms, co-working spaces and apartment groups within your delivery radius",
              do: "Offer the manager free bowls for their staff in exchange for putting a card at the desk",
              detail:
                "A gym with 300 members is a better targeting tool than any ad platform, and it costs five bowls.",
              paste: null,
            },
            {
              app: "WhatsApp Business",
              where:
                "Local resident and community groups you are genuinely part of",
              do: "Introduce yourself once, honestly, with the link",
              detail:
                "Once. Repeat posting in community groups gets you removed and remembered badly.",
              paste: null,
            },
          ],
          doneWhen: [
            "Two partnerships are live.",
            "You can trace at least five orders to a specific partnership.",
          ],
          pitfalls: [
            "Spamming groups you are not part of. It costs reputation you cannot buy back.",
          ],
        },
        lean: {
          tools: ["meta-ads", "instagram"],
          cost: "$100 test budget",
          tradeoff:
            "A small, honest test. Enough to learn, cheap enough to lose.",
          actions: [
            {
              app: "Meta Ads Manager",
              where:
                "Create → choose a traffic or engagement objective for a first test",
              do: "Set a 5km radius around your kitchen and a $7/day budget",
              detail:
                "Radius targeting is the whole reason to use Ads Manager instead of the Boost button. Boosting cannot restrict delivery-range targeting properly.",
              paste: null,
            },
            {
              app: "Meta Ads Manager",
              where: "Ad creative",
              do: "Run three creatives with the same offer and different hooks",
              detail:
                "Change one thing at a time. Three hooks against one offer tells you something; three offers and three hooks tells you nothing.",
              paste:
                "Write 3 ad hooks for a high-protein bowl delivery service in [city], each under 12 words, each aimed at [customer]. One should lead with the time saved, one with the protein number, one with the price compared to what they buy now. Plain language, no hype, no exclamation marks.",
            },
            {
              app: "Meta Ads Manager",
              where: "Columns → Customise columns → add cost per result",
              do: "After 4 days, compare cost per order against your ceiling from step 2",
              detail:
                "Four days is the minimum before judging. Killing an ad after one day is how you learn nothing repeatedly.",
              paste: null,
            },
          ],
          doneWhen: [
            "You know your cost per order as an actual number.",
            "You know which hook won and by how much.",
            "You have decided to scale it or stop it, on the number and not a feeling.",
          ],
          pitfalls: [
            "Targeting your whole city when you can only deliver to five kilometres of it.",
            "Judging after one day. The platform needs time before its numbers mean anything.",
            "Running ads before the pay button has been tested by a stranger.",
          ],
        },
        pro: {
          tools: ["meta-ads", "shopify"],
          cost: "$500+/mo",
          tradeoff:
            "Conversion tracking and retargeting. Needs real order volume to work at all.",
          actions: [
            {
              app: "Meta Ads Manager",
              where: "Events Manager → connect your store's dataset",
              do: "Install the pixel and verify purchase events are firing",
              detail:
                "Without a verified purchase event, the platform optimises toward clicks rather than orders, and clicks do not pay for ingredients.",
              paste: null,
            },
            {
              app: "Meta Ads Manager",
              where: "Audiences → Create audience → Website / Customer list",
              do: "Build a retargeting audience of people who reached checkout but did not buy",
              detail:
                "This is usually the cheapest paid order you will ever get -- they already wanted it.",
              paste: null,
            },
          ],
          doneWhen: [
            "Purchase events show in Events Manager within minutes of a test order.",
            "A retargeting campaign is live and beating cold traffic on cost per order.",
          ],
          pitfalls: [
            "Scaling budget 5x overnight. It resets the platform's learning and costs go up before they come down.",
          ],
        },
      },
    },
    {
      id: "s11",
      phase: "p-repeat",
      title: "Make the second order automatic",
      why: "A food business lives on repeat orders. Winning the same customer twice costs almost nothing; winning a new one costs everything you just spent on ads.",
      outcome: "A working reorder nudge and a measured repeat rate.",
      time: "2 hours",
      effort: 2,
      dependsOn: ["s10"],
      variants: {
        free: {
          tools: ["whatsapp-business", "claude"],
          cost: "$0",
          tradeoff:
            "You send the nudges by hand. Fifteen minutes a week, and it works better than most automation.",
          actions: [
            {
              app: "WhatsApp Business",
              where: "Settings → Business tools → Quick replies",
              do: "Save a reorder message as a quick reply with a shortcut",
              detail:
                "Quick replies turn a five-minute message into two keystrokes, which is the difference between doing it weekly and not doing it.",
              paste:
                "Hey [name] -- doing the [day] batch now. Want your usual [bowl]? Just say yes and it's on the list.",
            },
            {
              app: "WhatsApp Business",
              where: "Settings → Business tools → Broadcast lists",
              do: "Build a list of past customers and send one message a week",
              detail:
                "Broadcasts only reach people who have your number saved, so ask customers to save it at delivery. One message a week, never more.",
              paste: null,
            },
            {
              app: "Google Sheets",
              where: "A tab named 'Customers'",
              do: "Track name, first order date, last order date and times ordered",
              detail:
                "Repeat rate is the health metric for this business. If it is under 30% by month two, fix the food or the delivery before spending another rupee on ads.",
              paste: null,
            },
          ],
          doneWhen: [
            "Every past customer has had exactly one nudge.",
            "You can state your repeat rate as a percentage.",
            "At least three people have ordered a second time.",
          ],
          pitfalls: [
            "Messaging daily. You will be blocked, and blocks are permanent.",
            "Chasing new customers while the repeat rate is broken. That is a bucket with a hole in it.",
          ],
        },
        lean: {
          tools: ["whatsapp-business", "stripe", "claude"],
          cost: "Transaction fees",
          tradeoff:
            "A standing weekly order taken manually. Most of the benefit of subscriptions, none of the setup.",
          actions: [
            {
              app: "Stripe",
              where: "Payment links → create a link with a recurring price",
              do: "Offer a weekly 5-bowl plan at a small discount",
              detail:
                "Recurring revenue makes your shopping list predictable, which cuts wastage as much as it lifts revenue.",
              paste: null,
            },
            {
              app: "Claude",
              where: "New chat",
              do: "Write the pitch for the plan",
              detail:
                "Lead with what it removes from their week, not with the discount.",
              paste:
                "Write a short WhatsApp message offering my existing customers a weekly 5-bowl plan at [price], [X]% less than ordering one at a time. Lead with the time and decisions it saves them, not the discount. Under 60 words, plain and direct, no marketing voice.",
            },
          ],
          doneWhen: [
            "Five customers are on a standing weekly order.",
            "You know next week's volume before the week starts.",
          ],
          pitfalls: [
            "Discounting the plan so deep that loyal customers become your worst margin.",
          ],
        },
        pro: {
          tools: ["shopify", "claude"],
          cost: "~$25/mo for the subscription app",
          tradeoff:
            "Real subscriptions with self-serve pause and skip. Fewer cancellations, fewer messages.",
          actions: [
            {
              app: "Shopify",
              where: "Your subscription app's settings",
              do: "Let customers pause and skip a week without emailing you",
              detail:
                "People cancel when the only alternative to a delivery they do not want is cancelling. A skip button saves the subscription.",
              paste: null,
            },
            {
              app: "Shopify",
              where: "Analytics → Reports → Customers over time",
              do: "Track repeat rate and churn monthly",
              detail:
                "Watch which week subscribers usually cancel in, then put a check-in message the week before it.",
              paste: null,
            },
          ],
          doneWhen: [
            "Subscribers can pause without contacting you.",
            "You know your average subscription length in weeks.",
          ],
          pitfalls: [
            "Hiding the cancel option. It converts a pause into a chargeback and a bad review.",
          ],
        },
      },
    },
  ],
  checkpoints: [
    {
      id: "c1",
      afterStep: "s3",
      question: "How many of the ten pre-orders actually happened?",
      why: "This is the fork that decides whether you build or go back. Everything after it assumes people pay.",
      options: [
        {
          label: "Ten or more, at full price",
          then: "Keep going. Build the storefront and start the content engine -- demand is real.",
        },
        {
          label: "Four to nine",
          then: "The customer is right, the offer is not. Keep the customer, change one thing -- price, portion or delivery time -- and run step 3 again.",
        },
        {
          label: "Three or fewer",
          then: "Go back to step 1. It is the customer definition that is wrong, not the marketing. Re-run it before spending anything.",
        },
        {
          label: "Ten, but only because I discounted for friends",
          then: "That is a zero. Friends buy you, not the product. Run it again with strangers at full price.",
        },
      ],
    },
    {
      id: "c2",
      afterStep: "s7",
      question: "One-off orders, or a weekly subscription?",
      why: "It changes the site, the pricing and how much stock you buy. Deciding late means rebuilding.",
      options: [
        {
          label: "One-off orders for now",
          then: "Stay on the lean tier. A payment link and a one-page site is all you need until repeat orders show up.",
        },
        {
          label: "Weekly subscription",
          then: "Move to the pro tier for step 7. Subscription billing is the one thing genuinely worth paying a platform for.",
        },
        {
          label: "Not sure yet",
          then: "Sell one-off for four weeks and watch the repeat rate. Above 30%, subscriptions will work; below, they will not.",
        },
      ],
    },
    {
      id: "c3",
      afterStep: "s10",
      question: "After four days of ads, what is your cost per order?",
      why: "This decides whether paid acquisition is a channel for you or a leak.",
      options: [
        {
          label: "Below my ceiling from step 2",
          then: "Scale the budget 20-30% every few days. Faster than that resets the platform's learning.",
        },
        {
          label: "Above the ceiling, but people are clicking",
          then: "The ad works and the page does not. Fix the landing page and the offer before touching the targeting.",
        },
        {
          label: "Barely any clicks",
          then: "The creative is the problem. Rewrite the hooks and test three new ones before spending more.",
        },
        {
          label: "I cannot tell",
          then: "Stop spending until you can. Tracking first, budget second -- unmeasured ad spend is a donation.",
        },
      ],
    },
  ],
  metrics: [
    {
      label: "Paid pre-orders",
      target: "10",
      by: "End of week 1",
    },
    {
      label: "Repeat rate",
      target: "30% order a second time",
      by: "End of month 2",
    },
    {
      label: "Contribution margin per bowl",
      target: "Positive after packaging, delivery and fees",
      by: "Before the first ad runs",
    },
    {
      label: "Cost per order from ads",
      target: "Under your step-2 ceiling",
      by: "Day 4 of the first campaign",
    },
    {
      label: "Google reviews",
      target: "10",
      by: "End of month 2",
    },
  ],
  risks: [
    {
      risk: "Food arrives soggy, warm or leaking, and the customer never orders again without telling you why.",
      mitigation:
        "Run the 40-minute sit test on every new menu item, pack sauce separately, and ask for feedback within 48 hours while it is still fresh in their mind.",
    },
    {
      risk: "You scale marketing before unit economics work and lose money faster the better it goes.",
      mitigation:
        "The step-2 cost sheet gates the step-10 ad spend. No positive contribution margin, no ads.",
    },
    {
      risk: "An allergic reaction or a food safety incident.",
      mitigation:
        "Full allergen labelling from the first order, proper cold-chain handling, registration done in step 4, and liability cover before volume.",
    },
    {
      risk: "Burnout. One person cooking, delivering, posting and replying is not sustainable past about 40 orders a week.",
      mitigation:
        "Write the prep sheet so someone else can follow it (step 5), and cap weekly orders at a number you can actually produce until you have help.",
    },
    {
      risk: "Delivery costs quietly eat the margin as the radius grows.",
      mitigation:
        "Hard delivery-zone limits in checkout, a minimum order value, and a re-check of the cost sheet every time the radius changes.",
    },
  ],
};

import type { Clarify } from "./schema";

/** Demo-mode intake questions, matching the sample blueprint above. */
export const SAMPLE_CLARIFY: Clarify = {
  read: "You want to sell high-protein bowls, oats and shakes delivered to people's doors, and you need the website, the marketing and the first sales -- starting from zero.",
  questions: [
    {
      id: "q-budget",
      question: "What can you put in before the first sale?",
      why: "It decides whether you get a $0 route built on free tools, or a paid stack that moves faster.",
      options: [
        {
          label: "Nothing yet",
          hint: "Free tools only, and we prove demand before you spend.",
        },
        {
          label: "Under $50/month",
          hint: "Your own domain and automatic checkout.",
        },
        {
          label: "$200+/month",
          hint: "Full store, subscriptions and paid ads.",
        },
      ],
      allowCustom: true,
    },
    {
      id: "q-kitchen",
      question: "Where will you actually cook?",
      why: "It changes which licences you need and how many orders a week you can physically fill.",
      options: [
        {
          label: "My home kitchen",
          hint: "Home-kitchen registration, capped at what one person can produce.",
        },
        {
          label: "A rented or shared kitchen",
          hint: "Higher fixed cost, so we prove demand harder first.",
        },
        {
          label: "Haven't worked it out",
          hint: "We start at home and plan the move once orders repeat.",
        },
      ],
      allowCustom: false,
    },
    {
      id: "q-skills",
      question: "Have you built a website or run an ad before?",
      why: "It sets how much each step spells out, and whether we avoid anything with a learning curve.",
      options: [
        {
          label: "Neither, ever",
          hint: "No-code only, every click written out.",
        },
        {
          label: "Posted on social, nothing more",
          hint: "We lean on content first, ads later.",
        },
        { label: "Both, a bit", hint: "We move faster and skip the basics." },
      ],
      allowCustom: false,
    },
    {
      id: "q-time",
      question: "How much time do you have each week?",
      why: "A plan you cannot follow is worse than no plan. This sets the pace of the whole thing.",
      options: [
        {
          label: "Weekends only",
          hint: "Batched work, one phase per weekend.",
        },
        {
          label: "A couple of hours daily",
          hint: "Daily content engine, faster launch.",
        },
        {
          label: "This is full time",
          hint: "Compressed timeline, all channels at once.",
        },
      ],
      allowCustom: false,
    },
  ],
};
