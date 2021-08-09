import { existsSync, fstat, readFileSync, unlinkSync } from 'fs';
import * as path from 'path';
import { CustomLogger } from './CustomLogger';

describe('CustomLogger', () => {
  const logger = new CustomLogger();

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
      logger.log('1', 'test');

      expect(existsSync(generalLogPath)).toBe(true);

      const logs = readFileSync(generalLogPath, 'utf-8');

      expect(logs.endsWith('1')).toBe(true);
    });

    it('should append to a file that already exists', () => {
      logger.log('2', 'test');

      const logs = readFileSync(generalLogPath, 'utf-8');

      expect(logs.endsWith('2')).toBe(true);
    });

    it('should NOT write to a file on development', () => {
      logger.log('3', 'dev');

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
      logger.error('4', 'test');

      expect(existsSync(errorLogPath)).toBe(true);

      const logs = readFileSync(errorLogPath, 'utf-8');

      expect(logs.endsWith('4')).toBe(true);
    });

    it('should append to a file that already exists', () => {
      logger.error('5', 'test');

      const logs = readFileSync(errorLogPath, 'utf-8');

      expect(logs.endsWith('5')).toBe(true);
    });

    it('should NOT write to a file on development', () => {
      logger.error('6', 'dev');

      const logs = readFileSync(errorLogPath, 'utf-8');

      expect(logs.endsWith('6')).toBe(false);
    });
  });
});
