const { query, getOne } = require('../database/db');

exports.getPriceBreakdown = async (req, res) => {
  try {
    const cropName = req.params.crop || req.query.crop || 'Tomato';
    let record = await getOne('SELECT * FROM price_breakdowns WHERE crop_name = ?', [cropName]);

    if (!record) {
      record = {
        crop_name: cropName,
        buyer_price: 32.0,
        farmer_payout: 27.0,
        aggregation_fee: 1.0,
        logistics_fee: 2.0,
        platform_fee: 1.0,
        handling_fee: 1.0,
        notes: 'Standard transparent KisanSetu direct agri-network pricing structure.'
      };
    }

    const total = record.buyer_price;
    const farmerSharePct = Number(((record.farmer_payout / total) * 100).toFixed(1));
    const aggregationPct = Number(((record.aggregation_fee / total) * 100).toFixed(1));
    const logisticsPct = Number(((record.logistics_fee / total) * 100).toFixed(1));
    const platformPct = Number(((record.platform_fee / total) * 100).toFixed(1));
    const handlingPct = Number(((record.handling_fee / total) * 100).toFixed(1));

    // Comparative market benchmark (Traditional APMC multi-middleman chain)
    const traditionalComparison = {
      traditionalConsumerPrice: Number((total * 1.28).toFixed(1)), // ₹41/kg in traditional retail
      traditionalFarmerRealization: Number((record.farmer_payout * 0.72).toFixed(1)), // ₹19.4/kg in mandi
      middlemanLeakageSaved: Number((total * 0.28).toFixed(1)),
      farmerGainPercentage: '+39.2% higher farmer earnings',
      buyerSavingPercentage: '-21.9% lower buyer landed cost'
    };

    const breakdownItems = [
      {
        component: 'Farmer Direct Realization',
        amount: record.farmer_payout,
        unit: '₹/kg',
        percentage: farmerSharePct,
        color: '#15803d',
        description: 'Direct payout to farmer bank account without commission deductions.'
      },
      {
        component: 'Aggregation & Sorting / QC',
        amount: record.aggregation_fee,
        unit: '₹/kg',
        percentage: aggregationPct,
        color: '#f59e0b',
        description: 'Quality testing, crate sorting, and batch digital verification at cluster hub.'
      },
      {
        component: 'Cold-Chain & Route Logistics',
        amount: record.logistics_fee,
        unit: '₹/kg',
        percentage: logisticsPct,
        color: '#0284c7',
        description: 'Multi-pickup temperature-controlled refrigerated transit.'
      },
      {
        component: 'KisanSetu Platform Service',
        amount: record.platform_fee,
        unit: '₹/kg',
        percentage: platformPct,
        color: '#8b5cf6',
        description: 'AI demand matching, digital smart escrow, and compliance reporting.'
      },
      {
        component: 'Handling & Protective Packaging',
        amount: record.handling_fee,
        unit: '₹/kg',
        percentage: handlingPct,
        color: '#64748b',
        description: 'Reusable food-grade sanitized crates and transit insurance.'
      }
    ];

    return res.json({
      success: true,
      crop: record.crop_name,
      buyerPricePerKg: record.buyer_price,
      farmerPayoutPerKg: record.farmer_payout,
      breakdown: breakdownItems,
      comparison: traditionalComparison,
      farmerViewExample: {
        quantityKg: 500,
        expectedNetEarnings: 500 * record.farmer_payout,
        guaranteedDirectPayout: true
      },
      buyerViewExample: {
        quantityKg: 1000,
        totalLandedCost: 1000 * record.buyer_price,
        breakdownTotal: 1000 * record.buyer_price
      }
    });
  } catch (err) {
    console.error('getPriceBreakdown error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate price breakdown' });
  }
};
