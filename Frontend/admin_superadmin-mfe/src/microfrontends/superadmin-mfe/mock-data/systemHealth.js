export const mockSystemHealth = [
  {
    id: 'SH001',
    serviceName: 'Database Server',
    status: 'HEALTHY',
    responseTime: 45,
    uptime: 99.9,
    lastCheck: '2024-01-15T14:30:00Z',
    description: 'Primary database cluster operational',
    dependencies: ['Redis Cache', 'Backup System']
  },
  {
    id: 'SH002',
    serviceName: 'API Gateway',
    status: 'HEALTHY',
    responseTime: 120,
    uptime: 99.5,
    lastCheck: '2024-01-15T14:30:00Z',
    description: 'REST API gateway responding normally',
    dependencies: ['Load Balancer', 'Authentication Service']
  },
  {
    id: 'SH003',
    serviceName: 'Authentication Service',
    status: 'WARNING',
    responseTime: 250,
    uptime: 98.2,
    lastCheck: '2024-01-15T14:29:00Z',
    description: 'Slightly elevated response times detected',
    dependencies: ['Database Server', 'Redis Cache']
  },
  {
    id: 'SH004',
    serviceName: 'Payment Gateway',
    status: 'HEALTHY',
    responseTime: 180,
    uptime: 99.8,
    lastCheck: '2024-01-15T14:30:00Z',
    description: 'External payment integrations operational',
    dependencies: ['Bank APIs', 'SMS Service']
  },
  {
    id: 'SH005',
    serviceName: 'Email Service',
    status: 'HEALTHY',
    responseTime: 95,
    uptime: 99.7,
    lastCheck: '2024-01-15T14:30:00Z',
    description: 'Email delivery service functioning normally',
    dependencies: ['SMTP Server', 'Template Engine']
  },
  {
    id: 'SH006',
    serviceName: 'File Storage',
    status: 'HEALTHY',
    responseTime: 60,
    uptime: 99.9,
    lastCheck: '2024-01-15T14:30:00Z',
    description: 'Document and media storage operational',
    dependencies: ['CDN', 'Backup System']
  },
  {
    id: 'SH007',
    serviceName: 'SMS Service',
    status: 'ERROR',
    responseTime: 0,
    uptime: 85.3,
    lastCheck: '2024-01-15T14:28:00Z',
    description: 'SMS gateway connection failed',
    dependencies: ['External SMS Provider']
  },
  {
    id: 'SH008',
    serviceName: 'Redis Cache',
    status: 'HEALTHY',
    responseTime: 12,
    uptime: 99.95,
    lastCheck: '2024-01-15T14:30:00Z',
    description: 'Cache layer operational',
    dependencies: []
  }
]
