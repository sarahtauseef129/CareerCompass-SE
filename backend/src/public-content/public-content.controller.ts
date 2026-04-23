import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

@Controller()
export class PublicContentController {

  // Landing page info
  @Get()
  @HttpCode(HttpStatus.OK)
  getLandingPage() {
    return {
      app: 'CareerCompass',
      tagline: 'Discover the career that fits you best',
      features: [
        'Personalized career assessments',
        'AI-powered career guidance',
        'Skill gap analysis',
        'Learning roadmaps',
        'Career comparison tools',
      ],
      version: '1.0.0',
    };
  }

  // Privacy policy
  @Get('privacy-policy')
  @HttpCode(HttpStatus.OK)
  getPrivacyPolicy() {
    return {
      lastUpdated: '2025-01-01',
      content: [
        {
          section: 'Data Collection',
          text: 'We collect information you provide during registration and assessments.',
        },
        {
          section: 'Data Usage',
          text: 'Your data is used solely to generate career recommendations and improve our system.',
        },
        {
          section: 'Data Protection',
          text: 'All data is encrypted and stored securely. We do not sell your data to third parties.',
        },
        {
          section: 'Contact',
          text: 'For privacy concerns, contact us at privacy@careercompass.com.',
        },
      ],
    };
  }
}