import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput, Modal, Share, Platform } from 'react-native';
import { TopBar } from '../../src/components/TopBar';
import { useTheme } from '../../src/theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

/* ── Project Images (from WhatsApp catalogue + official campus assets) ─ */
const PROJECT_IMAGES: Record<string, any> = {
  '1': require('../../assets/images/projects/vasai_west.jpg'),
  '2': require('../../assets/images/projects/suraksha_smart_city.jpg'),
  '3': require('../../assets/images/projects/rustomjee_global_city.jpg'),
  '4': require('../../assets/images/projects/kajupada.jpg'),
  '5': require('../../assets/images/projects/eksar.jpg'),
  '6': require('../../assets/images/projects/royal_kandivali.jpg'),
  '7': require('../../assets/images/projects/dimple_73.jpg'),
  '8': require('../../assets/images/projects/xl_mumbai.jpg'),
  '9': require('../../assets/images/projects/malad_40storey.jpg'),
  '10': require('../../assets/images/projects/goregaon_sv_road.jpg'),
  '11': require('../../assets/images/projects/samarth_goregaon.jpg'),
  '12': require('../../assets/images/projects/virar_jakat_naka.jpg'),
  '13': require('../../assets/images/projects/goregaon_sv_road_2.jpg'),
};

/* ── Real project data (from WhatsApp catalogue + web research) ─ */
const PROJECTS = [
  {
    id: '1',
    name: 'Vasai West Residency',
    location: 'Vasai West, Palghar',
    area: 'Vasai',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK & 2 BHK',
    price: '₹64.50 L – ₹86.30 L',
    rera: 'MahaRERA Registered',
    photoLabel: 'Furnished Show Flat',
    description: '1 BHK (500 sq.ft carpet) at ₹64.50 Lacs & 2 BHK (704 sq.ft carpet) at ₹86.30 Lacs. All-inclusive pricing covering Parking, GST, Stamp Duty, Registration, etc.',
    amenities: ['Covered Parking', 'Modular Kitchen', 'Vitrified Flooring', 'Designer Interiors', '24/7 Water Supply'],
  },
  {
    id: '2',
    name: 'Suraksha Smart City',
    location: 'Vasai East (Madhuban Township)',
    area: 'Vasai',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK',
    price: '₹19.99 L – ₹22.50 L',
    rera: 'P99000023396',
    photoLabel: '360+ Acre Mega-Township Campus',
    description: 'Luxury residential township by Suraksha Group. MHADA Lottery System with ₹2.50 Lakh booking benefit. 1 BHK at ₹22.5 Lac (283 sq.ft carpet / 375 sq.ft usable area). Government Approved project with 40+ lifestyle amenities.',
    amenities: ['Themed Gardens', 'Sports Facilities', 'Clubhouse', 'Rain Water Harvesting', 'Earthquake Resistant', 'CCTV Security', '24/7 Water Supply'],
  },
  {
    id: '3',
    name: 'Global City Virar West',
    location: 'Virar West, Palghar',
    area: 'Virar',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK & 2 BHK',
    price: '₹31 L – ₹60 L',
    rera: 'P99000018043',
    photoLabel: 'Rustomjee 200-Acre Township & Towers',
    description: 'Rustomjee Global City — mega-township spread over 200+ acres with Yazoo Park. Premium residences with world-class amenities and excellent Western Line connectivity.',
    amenities: ['Podium Parking', 'High Speed Elevators', 'Sewage Treatment Plant', 'Grand Entrance Lobby', 'Rain Water Harvesting', 'Landscaped Podium', 'Earthquake Resistant', 'Firefighting Systems', 'CCTV Cameras', 'Vitrified Flooring', 'Sliding Windows', 'Designer Main Door', 'Intercom Systems', 'Concealed Copper Wiring', 'Modular Switches', 'Laminated Flush Doors', 'Modular Kitchen', 'Granite Counter Top'],
  },
  {
    id: '4',
    name: 'Kajupada Residency',
    location: 'Kajupada, Borivali East',
    area: 'Borivali',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK & 2 BHK',
    price: '₹65 L onwards',
    rera: 'MahaRERA Registered',
    photoLabel: 'High-Rise Tower Elevation',
    description: 'Premium residential project in Kajupada, Borivali East. Well-connected location close to Sanjay Gandhi National Park with excellent social infrastructure and transit access.',
    amenities: ['Covered Parking', 'Landscaped Garden', 'Children\'s Play Area', '24/7 Security', 'High-Speed Lifts'],
  },
  {
    id: '5',
    name: 'Eksar Borivali West',
    location: 'Eksar, Borivali West',
    area: 'Borivali',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK, 2 BHK & 3 BHK',
    price: '₹89 L – ₹3.22 Cr',
    rera: 'P51800028105',
    photoLabel: 'Modern Residential Complex',
    description: 'Western Mumbai\'s premium Borivali address. Multiple towers with spacious configurations near Eksar Road. Average rate ₹24,000–₹34,000/sq.ft. Well-connected to Western Express Highway and local transit.',
    amenities: ['Gymnasium', 'Landscaped Gardens', 'Rainwater Harvesting', 'CCTV Surveillance', 'High-Speed Elevators', 'Power Backup'],
  },
  {
    id: '6',
    name: 'Royal Kandivali East',
    location: 'Ashok Nagar, Kandivali East',
    area: 'Kandivali',
    type: 'Residential',
    status: 'Active',
    configs: '1 RK, 1 BHK & 2 BHK',
    price: '₹54 L – ₹1.35 Cr',
    rera: 'P51800022042',
    photoLabel: 'Shree Royal Height Tower Elevation',
    description: 'Shree Royal Height by Royal Realtors Group. Live at the upper crest of Kandivali East. Compact luxury living with 1 RK (241 sq.ft) from ₹54.23 L, 1 BHK (301–361 sq.ft) from ₹67.72 L, and 2 BHK (467 sq.ft) from ₹1.05 Cr.',
    amenities: ['Gymnasium', 'Landscaped Garden', 'Rainwater Harvesting', 'Sewage Treatment Plant', 'CCTV Security', 'High-Speed Elevators', 'Power Backup'],
  },
  {
    id: '7',
    name: 'Dimple 73',
    location: 'Off Link Road, Kandivali West',
    area: 'Kandivali',
    type: 'Residential',
    status: 'Active',
    configs: '2 BHK, 3 BHK & 4 BHK',
    price: '₹2.15 Cr – ₹6.95 Cr',
    rera: 'P51800015343',
    photoLabel: 'Grand Entrance & Elevation',
    description: 'Premium high-rise by Dimple Group. 2 BHK (720–831 sq.ft) from ₹2.15 Cr, 3 BHK (1,462 sq.ft) from ₹4.36 Cr. Close to Western Express Highway and Metro stations.',
    amenities: ['Swimming Pool', 'Gymnasium', 'Indoor Games', 'Kids Play Area', 'Sauna/Spa', 'Multi-Purpose Hall', '24/7 CCTV Security'],
  },
  {
    id: '8',
    name: 'XL Mumbai',
    location: 'Off SV Road, Kandivali West',
    area: 'Kandivali',
    type: 'Residential',
    status: 'Active',
    configs: '2 BHK Sky Residences',
    price: '₹1.80 Cr – ₹2.30 Cr',
    rera: 'P51800007630',
    photoLabel: '59-Storey Iconic Skyscraper',
    description: 'The TALLEST tower of Kandivali — 59-storey iconic sky-scraper by Ruparel Realty. Exclusive 2 BHK Sky Residences (620–710 sq.ft carpet) with private balconies and panoramic city views.',
    amenities: ['Sky Lounge', 'Infinity Pool', 'Private Balconies', 'Multi-Tier Security', 'High-Speed Elevators', 'Landscaped Podium', 'Club House'],
  },
  {
    id: '9',
    name: '40 Storey Residential Project',
    location: 'Malad, Mumbai',
    area: 'Malad',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK, 2 BHK & 3 BHK',
    price: '₹1.10 Cr – ₹5.00 Cr',
    rera: 'MahaRERA Registered',
    photoLabel: '40-Storey Skyscraper Facade',
    description: 'Premium 40-storey high-rise in Malad with limited flats available. Luxury residences featuring wrap-around views, modern amenities, and proximity to Metro stations and Link Road.',
    amenities: ['High-Rise Living', 'Panoramic Views', 'Club House', 'Swimming Pool', 'Gymnasium', 'Landscaped Podium', 'Multi-Tier Security'],
  },
  {
    id: '10',
    name: 'S.V. Road Goregaon West',
    location: 'S.V. Road, Goregaon West',
    area: 'Goregaon',
    type: 'Residential',
    status: 'Active',
    configs: '2 BHK, 3 BHK & 4 BHK',
    price: '₹1.80 Cr – ₹5.70 Cr',
    rera: 'MahaRERA Registered',
    photoLabel: 'Twin Tower Luxury Elevation',
    description: 'Luxury that lasts a lifetime. Premium high-rise residences on S.V. Road, Goregaon West. Average rate ₹30,000–₹36,000/sq.ft. Seamless connectivity via SV Road, Western Express Highway, and Metro Line 2A.',
    amenities: ['Sky Deck', 'Club House', 'Swimming Pool', 'Gymnasium', 'Landscaped Gardens', 'Multi-Tier Security', 'Power Backup', 'High-Speed Elevators'],
  },
  {
    id: '11',
    name: 'Samarth',
    location: 'Nr. Hub Mall, Off W.E.H, Goregaon',
    area: 'Goregaon',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK & 2 BHK',
    price: '₹1.16 Cr – ₹4.63 Cr',
    rera: 'P51800011356',
    photoLabel: 'Contemporary High-Rise Tower',
    description: 'Premium residences near Hub Mall, Goregaon. Well-connected location off Western Express Highway. 1 BHK (384 sq.ft) and larger configurations available with modern amenities.',
    amenities: ['Covered Parking', 'Landscaped Garden', 'Club House', 'Gymnasium', 'Children\'s Play Area', 'Security'],
  },
  {
    id: '12',
    name: 'Jakat Naka Virar West',
    location: 'Jakat Naka, Virar West',
    area: 'Virar',
    type: 'Residential',
    status: 'Active',
    configs: '1 BHK (multiple options)',
    price: 'Contact for Price',
    rera: 'MahaRERA Registered',
    photoLabel: 'Residential Community Building',
    description: '1 BHK apartments with multiple configuration options in Jakat Naka, Virar West. Affordable housing in a rapidly developing area with good connectivity to Virar Railway Station.',
    amenities: ['Covered Parking', 'Garden', 'Security', 'Water Supply'],
  },
  {
    id: '13',
    name: 'S.V. Road High-Rise (See & Believe)',
    location: 'S.V. Road, Goregaon West',
    area: 'Goregaon',
    type: 'Residential',
    status: 'Active',
    configs: '2 BHK & 3 BHK',
    price: '₹2.10 Cr – ₹4.85 Cr',
    rera: 'MahaRERA Registered',
    photoLabel: 'Skyline Facing High-Rise',
    description: 'Iconic high-rise tower facing S.V. Road with uninterrupted skyline views. Ultra-spacious layouts with sundecks, Italian marble finishes, and state-of-the-art society amenities.',
    amenities: ['Skyline Views', 'Grand Entrance Lobby', 'Automated Car Parking', 'Fitness Center', 'Rooftop Lounge', '24/7 Security'],
  },
];

/* ── Helper ───────────────────────────────────────────────────── */
const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Active:    { bg: '#059669', text: '#fff' },
  Upcoming:  { bg: '#D97706', text: '#fff' },
  Completed: { bg: '#6366F1', text: '#fff' },
};

const AREAS = ['All Areas', 'Vasai', 'Virar', 'Borivali', 'Kandivali', 'Malad', 'Goregaon'];

export default function OurProjects() {
  const { colors } = useTheme();
  const [filter, setFilter] = useState<string>('All');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<{ img: any; title: string; label: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filters = ['All', 'Active', 'Upcoming', 'Completed'];

  // Filtering
  const filteredProjects = PROJECTS.filter((p) => {
    // Status filter
    if (filter !== 'All' && p.status !== filter) return false;
    // Area filter
    if (selectedArea !== 'All Areas' && p.area !== selectedArea) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchLoc = p.location.toLowerCase().includes(q);
      const matchConfig = p.configs.toLowerCase().includes(q);
      const matchRera = p.rera.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchConfig && !matchRera) return false;
    }
    return true;
  });

  // Unique areas
  const uniqueAreas = new Set(PROJECTS.map(p => p.area));

  // Copy details helper
  const handleCopyDetails = (p: typeof PROJECTS[0]) => {
    const text = `🏢 *${p.name}*\n📍 Location: ${p.location}\n💰 Price: ${p.price}\n📐 Configurations: ${p.configs}\n📜 MahaRERA: ${p.rera}\n\n${p.description}\n\n✨ Key Amenities: ${p.amenities.slice(0, 5).join(', ')}`;
    if (Platform.OS === 'web' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(p.id);
      setTimeout(() => setCopiedId(null), 2500);
    } else {
      Share.share({ message: text });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        title="Our Projects"
        subtitle="Real estate projects across Mumbai Metropolitan Region"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* ── Search & Filter Bar ────────────────────── */}
        <View style={[styles.searchBarContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search projects by name, location, configuration (e.g. Goregaon, 2 BHK)..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </View>

        {/* ── Area and Status Chips ──────────────────── */}
        <View style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {AREAS.map((a) => {
              const active = selectedArea === a;
              return (
                <Pressable
                  key={a}
                  onPress={() => setSelectedArea(a)}
                  style={[
                    styles.areaChip,
                    {
                      backgroundColor: active ? colors.primary : colors.surface,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={active ? '#fff' : colors.textSecondary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={{ color: active ? '#fff' : colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                    {a}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.statusRow}>
            {filters.map((f) => {
              const active = filter === f;
              return (
                <Pressable
                  key={f}
                  onPress={() => setFilter(f)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? colors.text : colors.surface,
                      borderColor: active ? colors.text : colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: active ? colors.background : colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                    {f}
                  </Text>
                </Pressable>
              );
            })}
            <View style={{ flex: 1 }} />
            <Text style={{ color: colors.textMuted, fontSize: 12 }}>
              Showing {filteredProjects.length} of {PROJECTS.length} projects
            </Text>
          </View>
        </View>

        {/* ── Summary statistics row ─────────────────── */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="business-outline" size={22} color={colors.primary} />
            <Text style={[styles.summaryValue, { color: colors.text }]}>{PROJECTS.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total Projects</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="checkmark-circle-outline" size={22} color="#059669" />
            <Text style={[styles.summaryValue, { color: colors.text }]}>{PROJECTS.filter(p => p.status === 'Active').length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Active Available</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="location-outline" size={22} color="#D97706" />
            <Text style={[styles.summaryValue, { color: colors.text }]}>{uniqueAreas.size} Hubs</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Prime Locations</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Ionicons name="images-outline" size={22} color="#6366F1" />
            <Text style={[styles.summaryValue, { color: colors.text }]}>{PROJECTS.length}</Text>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Campus Photos</Text>
          </View>
        </View>

        {/* ── Project cards ──────────────────────────── */}
        {filteredProjects.map((project) => {
          const statusColor = STATUS_COLORS[project.status] || STATUS_COLORS.Active;
          const isExpanded = expandedId === project.id;
          const imgSource = PROJECT_IMAGES[project.id];
          const isCopied = copiedId === project.id;

          return (
            <View
              key={project.id}
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.cardMain}>
                {/* ── Society Campus Image ──────────────── */}
                <Pressable
                  onPress={() => setPreviewImage({ img: imgSource, title: project.name, label: project.photoLabel })}
                  style={styles.imageContainer}
                >
                  <Image
                    source={imgSource}
                    style={styles.projectImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlayBadge}>
                    <Ionicons name="camera-outline" size={11} color="#fff" />
                    <Text style={styles.imageOverlayText} numberOfLines={1}>
                      {project.photoLabel}
                    </Text>
                  </View>
                  <View style={styles.zoomIconWrap}>
                    <Ionicons name="expand-outline" size={14} color="#fff" />
                  </View>
                </Pressable>

                {/* ── Project Details ───────────────────── */}
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{project.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                          <Text style={{ color: statusColor.text, fontSize: 10, fontWeight: '700' }}>
                            {project.status}
                          </Text>
                        </View>
                        <View style={[styles.areaBadge, { backgroundColor: colors.primary + '15', borderColor: colors.primary + '30' }]}>
                          <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '600' }}>
                            {project.area}
                          </Text>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{project.location}</Text>
                        <Text style={{ color: colors.border, fontSize: 12 }}> · </Text>
                        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{project.type}</Text>
                      </View>
                    </View>

                    {/* Quick Broker Actions */}
                    <View style={styles.headerActionBtns}>
                      <Pressable
                        onPress={() => handleCopyDetails(project)}
                        style={[
                          styles.actionBtn,
                          {
                            backgroundColor: isCopied ? '#059669' : colors.primary + '15',
                            borderColor: isCopied ? '#059669' : colors.primary + '30',
                          },
                        ]}
                      >
                        <Ionicons
                          name={isCopied ? 'checkmark' : 'copy-outline'}
                          size={13}
                          color={isCopied ? '#fff' : colors.primary}
                        />
                        <Text style={{ color: isCopied ? '#fff' : colors.primary, fontSize: 11, fontWeight: '600' }}>
                          {isCopied ? 'Copied!' : 'Copy'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 8, lineHeight: 19 }}>
                    {project.description}
                  </Text>

                  {/* Info row */}
                  <View style={styles.infoRow}>
                    <View style={styles.infoBlock}>
                      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Price Range</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>{project.price}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Configurations</Text>
                      <Text style={[styles.infoValue, { color: colors.text }]}>{project.configs}</Text>
                    </View>
                    <View style={styles.infoBlock}>
                      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>RERA</Text>
                      <Text style={[styles.infoValue, { color: colors.primary }]}>{project.rera}</Text>
                    </View>
                  </View>

                  {/* Amenities toggle */}
                  <Pressable
                    onPress={() => setExpandedId(isExpanded ? null : project.id)}
                    style={styles.expandRow}
                  >
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '600' }}>
                      {isExpanded ? 'Hide Amenities' : `View ${project.amenities.length} Amenities & Features`}
                    </Text>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={15}
                      color={colors.primary}
                    />
                  </Pressable>

                  {/* Amenities (expanded) */}
                  {isExpanded && (
                    <View style={styles.expandedSection}>
                      <Text style={[styles.infoLabel, { color: colors.textMuted, marginBottom: 8 }]}>
                        Amenities & Society Features
                      </Text>
                      <View style={styles.amenitiesWrap}>
                        {project.amenities.map((a, i) => (
                          <View
                            key={i}
                            style={[
                              styles.amenityTag,
                              { backgroundColor: colors.primary + '12', borderColor: colors.primary + '30' },
                            ]}
                          >
                            <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                            <Text style={{ color: colors.text, fontSize: 11, fontWeight: '500' }}>{a}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        {filteredProjects.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="business-outline" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textMuted, marginTop: 12, fontSize: 14 }}>
              No projects match your current filters.
            </Text>
            <Pressable
              onPress={() => {
                setFilter('All');
                setSelectedArea('All Areas');
                setSearchQuery('');
              }}
              style={[styles.resetBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Reset Filters</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* ── High-Res Society Campus Image Modal ──────── */}
      <Modal
        visible={!!previewImage}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setPreviewImage(null)}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{previewImage?.title}</Text>
                <Text style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>
                  {previewImage?.label}
                </Text>
              </View>
              <Pressable
                onPress={() => setPreviewImage(null)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={20} color={colors.text} />
              </Pressable>
            </View>

            {previewImage && (
              <View style={styles.modalImageWrap}>
                <Image
                  source={previewImage.img}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            )}

            <View style={styles.modalFooter}>
              <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                Verified society campus and elevation photograph from catalogue records.
              </Text>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
    outlineWidth: 0,
  },
  filterSection: {
    gap: 12,
  },
  chipsScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  summaryRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  summaryCard: {
    flex: 1,
    minWidth: 140,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  summaryValue: { fontSize: 22, fontWeight: '700' },
  summaryLabel: { fontSize: 11, fontWeight: '500' },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  cardMain: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: 220,
    minHeight: 180,
    position: 'relative',
    backgroundColor: '#0f172a',
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: '100%',
    minHeight: 180,
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  imageOverlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    flex: 1,
  },
  zoomIconWrap: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    minWidth: 280,
    padding: 18,
    justifyContent: 'space-between',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  areaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  headerActionBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoRow: { flexDirection: 'row', marginTop: 14, gap: 16, flexWrap: 'wrap' },
  infoBlock: { minWidth: 120 },
  infoLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  infoValue: { fontSize: 13, fontWeight: '600' },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    alignSelf: 'flex-start',
  },
  expandedSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150,150,150,0.15)',
  },
  amenitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  resetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 720,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.15)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseBtn: {
    padding: 6,
    borderRadius: 8,
  },
  modalImageWrap: {
    width: '100%',
    height: 420,
    backgroundColor: '#090d16',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalFooter: {
    padding: 14,
    alignItems: 'center',
  },
});
