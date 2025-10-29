import tsparser from '@typescript-eslint/parser';
export declare const ignoreConfig: {
    readonly ignores: readonly ["dist"];
};
export declare const typescriptConfig: {
    readonly files: readonly ["**/*.{ts,tsx}"];
    readonly languageOptions: {
        readonly parser: typeof tsparser;
        readonly parserOptions: {
            readonly project: readonly ["./tsconfig.json"];
            readonly sourceType: "module";
        };
    };
    readonly plugins: {
        readonly '@typescript-eslint': unknown;
        readonly import: unknown;
    };
    readonly rules: {
        readonly '@typescript-eslint/no-unused-vars': readonly ["error", {
            readonly argsIgnorePattern: "^_";
        }];
        readonly 'import/order': readonly ["error", {
            readonly 'newlines-between': "always";
            readonly alphabetize: {
                readonly order: "asc";
                readonly caseInsensitive: true;
            };
        }];
    };
};
export declare const config: readonly [{
    readonly ignores: readonly ["dist"];
}, {
    readonly rules: Readonly<import("eslint").Linter.RulesRecord>;
}, {
    readonly files: readonly ["**/*.{ts,tsx}"];
    readonly languageOptions: {
        readonly parser: typeof tsparser;
        readonly parserOptions: {
            readonly project: readonly ["./tsconfig.json"];
            readonly sourceType: "module";
        };
    };
    readonly plugins: {
        readonly '@typescript-eslint': unknown;
        readonly import: unknown;
    };
    readonly rules: {
        readonly '@typescript-eslint/no-unused-vars': readonly ["error", {
            readonly argsIgnorePattern: "^_";
        }];
        readonly 'import/order': readonly ["error", {
            readonly 'newlines-between': "always";
            readonly alphabetize: {
                readonly order: "asc";
                readonly caseInsensitive: true;
            };
        }];
    };
}, any];
export default config;
