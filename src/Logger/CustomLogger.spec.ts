import { existsSync, fstat, readFileSync, unlinkSync } from 'fs';
import * as path from 'path';
import { CustomLogger } from './CustomLogger';

describe('CustomLogger', () => {
  const testLogger = new CustomLogger('TESTING',{stage: 'test'});

  const logsPath = path.join(
    __dirname,
    '..',
    path.sep,
    '..',
    path.sep,
    'logs',
    path.sep,
  );

  describe('logger.log', () => {
    const generalLogPath = path.join(logsPath, 'general.test.log');

    beforeAll(() => {
      if (existsSync(generalLogPath)) unlinkSync(generalLogPath);
    });
    afterAll(() => {
      if (existsSync(generalLogPath)) unlinkSync(generalLogPath);
    });

    it("should create a file and write if it doesn't exist", () => {
      testLogger.log('1');

      expect(existsSync(generalLogPath)).toBe(true);

      const logs = readFileSync(generalLogPath, 'utf-8');

      expect(logs.endsWith('1')).toBe(true);
    });

    it('should append to a file that already exists', () => {
      testLogger.log('2');

      const logs = readFileSync(generalLogPath, 'utf-8');

      expect(logs.endsWith('2')).toBe(true);
    });

    it('should NOT write to a file on development', () => {
      const devLogger = new CustomLogger('TESTING',{stage:'dev'})
      devLogger.log('3');

      const logs = readFileSync(generalLogPath, 'utf-8');

      expect(logs.endsWith('3')).toBe(false);
    });
  });

  describe('logger.error', () => {
    const errorLogPath = path.join(logsPath, 'error.test.log');

    beforeAll(() => {
      if (existsSync(errorLogPath)) unlinkSync(errorLogPath);
    });
    afterAll(() => {
      if (existsSync(errorLogPath)) unlinkSync(errorLogPath);
    });

    it("should create a file and write if it doesn't exist", () => {
      testLogger.error('4');

      expect(existsSync(errorLogPath)).toBe(true);

      const logs = readFileSync(errorLogPath, 'utf-8');

      expect(logs.endsWith('4')).toBe(true);
    });

    it('should append to a file that already exists', () => {
      testLogger.error('5');

      const logs = readFileSync(errorLogPath, 'utf-8');

      expect(logs.endsWith('5')).toBe(true);
    });

    it('should NOT write to a file on development', () => {
      const devLogger = new CustomLogger('TESTING', {stage: 'dev'})
      devLogger.error('6');

      const logs = readFileSync(errorLogPath, 'utf-8');

      expect(logs.endsWith('6')).toBe(false);
    });
  });
});
