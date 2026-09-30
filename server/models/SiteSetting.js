import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema({
  farmhouseName: {
    type: String,
    default: 'Yashwant Farmhouse'
  },
  nameMarathi: {
    type: String,
    default: 'यशवंत फार्महाऊस'
  },
  tagline: {
    type: String,
    default: 'A peaceful farmhouse getaway in Nandwal, Kolhapur.'
  },
  owner: {
    type: String,
    default: 'Pandurang Yashwant Patil'
  },
  phonePrimary: {
    type: String,
    default: '+918010042002'
  },
  phonePrimaryDisplay: {
    type: String,
    default: '80100 42002'
  },
  phoneSecondary: {
    type: String,
    default: '+919975919947'
  },
  phoneSecondaryDisplay: {
    type: String,
    default: '99759 19947'
  },
  whatsappNumber: {
    type: String,
    default: '918010042002'
  },
  locationVillage: {
    type: String,
    default: 'Nandwal'
  },
  locationCity: {
    type: String,
    default: 'Kolhapur'
  },
  locationState: {
    type: String,
    default: 'Maharashtra'
  },
  locationCountry: {
    type: String,
    default: 'India'
  },
  locationFull: {
    type: String,
    default: 'Nandwal, Kolhapur, Maharashtra, India'
  },
  locationShort: {
    type: String,
    default: 'Nandwal, Kolhapur'
  },
  mapsUrl: {
    type: String,
    default: 'https://maps.app.goo.gl/N341yLui8hh7EGDp9?g_st=aw'
  },
  mapsEmbedUrl: {
    type: String,
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.5!2d74.22!3d16.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc055007e08b7b5%3A0x451566f0840fa534!2z4KSv4KS24KS14KSC4KSkIOCkq-CkvuCksOCljeCkruCkueCkvuCkiuCkuA!5e0!3m2!1sen!2sin!4v1695000000000'
  }
}, {
  timestamps: true
});

const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', siteSettingSchema);
export default SiteSetting;
