import { Grid, Link, Typography } from '@mui/material';

const footerSections = [
  {
    title: 'Sản phẩm',
    items: ['PC Gaming', 'PC Văn phòng', 'Linh kiện', 'Màn hình', 'Phụ kiện'],
  },
  {
    title: 'Hướng dẫn',
    items: ['Hướng dẫn mua hàng', 'Hướng dẫn thanh toán', 'Hướng dẫn lắp đặt'],
  },
  {
    title: 'Chính sách',
    items: ['Bảo hành', 'Đổi trả', 'Vận chuyển', 'Bảo mật'],
  },
  {
    title: 'Liên hệ',
    items: [
      { label: 'Zalo: 0911910949', link: 'https://zalo.me/0911910949' },
      { label: 'Facebook: Nguyễn Duy Tú', link: 'https://www.facebook.com/1906tu'},
      { label: 'Email: duytu192003', link: 'mailto:duytu192003@gmail.com' },
      { label: 'Địa chỉ: 123 Lê Lợi, TP.HCM' },
    ],
  }
];

const Footer = () => {
  return (
    <Grid
      container
      spacing={4}
      sx={{
        bgcolor: '#000',
        color: '#fff',
        py: 6,
        px: { xs: 2, md: 6 },
      }}
    >
      {footerSections.map((section, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: '#fff', pb: 1 }}
          >
            {section.title}
          </Typography>
          {section.items.map((item, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
              {typeof item === 'string' ? (
                item
              ) : item.link ? (
                <Link
                  href={item.link}
                  underline="hover"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#fff', '&:hover': { color: '#ccc' } }}
                >
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </Typography>
          ))}
        </Grid>
      ))}

      <Grid item xs={12}>
        <Typography
          variant="body2"
          align="center"
          sx={{
            pt: 4,
            borderTop: '1px solid #444',
            color: '#fff',
          }}
        >
          &copy; 2025 PCShop.vn - Học viện Công nghệ Bưu chính Viễn thông
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;

